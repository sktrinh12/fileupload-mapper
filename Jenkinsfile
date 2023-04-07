apps = ['frontend', 'backend']
pipeline {
    agent { 
        kubernetes{
            inheritFrom 'jenkins-slave'
        }
    }
    parameters {
				booleanParam defaultValue: true, description: 'build the frontend', name: 'BUILD_FRONTEND'
				booleanParam defaultValue: false, description: 'build the backend', name: 'BUILD_BACKEND'
		}
    options {
        timeout(time: 5, unit: 'MINUTES')
    }
    environment{
        AWSID = credentials('AWSID')
        DOCKER_PSW = credentials('DOCKER_PASSWORD')
        DOCKER_CONFIG = "${WORKSPACE}/docker.config"
        NAMESPACE = 'apps'
        APP_NAME = 'fileupload-mapper'
        AWS_PAGER = ''
    }

    stages {
        stage('docker login') {
            steps {
                script {
                    withCredentials([aws(credentialsId: 'awscredentials', region: 'us-west-2')]) {
                    sh '''
                        aws ecr get-login-password \
                        --region us-west-2 \
                        | docker login --username AWS \
                        --password-stdin $AWSID.dkr.ecr.us-west-2.amazonaws.com
                       '''
                    }
                }
            }
        }

        stage('docker build backend') {
            steps{
               sh( label: 'Docker Build Backend', script:
               '''
                #!/bin/bash
                set -x
                ls -ltra
                if [[ $BUILD_BACKEND == true ]]; then
                  docker build \
                  --no-cache --network=host \
                  -t ${AWSID}.dkr.ecr.us-west-2.amazonaws.com/$APP_NAME-backend:latest \
                  -f backend/Dockerfile.prod .
                else
                  echo "skipping backend build"
                fi
                ''', returnStdout: true
                )
                
            }
        }
        
        stage('docker build frontend') {
            steps{
                sh( label: 'Docker Build Frontend', script:
                '''
                #!/bin/bash
                set -x
                if [[ $BUILD_FRONTEND == true ]]; then
                  docker build \
                  --no-cache --network=host \
                  -t $AWSID.dkr.ecr.us-west-2.amazonaws.com/$APP_NAME-frontend:latest \
                  -f frontend/Dockerfile.prod .
                else
                  echo "skipping frontend build"
                fi
                ''', returnStdout: true
                )
            }
        }
        
    
        stage('docker push to ecr') {
            steps {
                sh(label: 'ECR docker push frontend', script:
                '''
                if [[ $BUILD_FRONTEND == true ]]; then
                  docker push $AWSID.dkr.ecr.us-west-2.amazonaws.com/$APP_NAME-frontend:latest
                else
                  echo "skipping frontend image push"
                fi
                ''', returnStdout: true
                )
                sh(label: 'ECR docker push backend', script:
                '''
                if [[ $BUILD_BACKEND == true ]]; then
                  docker push $AWSID.dkr.ecr.us-west-2.amazonaws.com/$APP_NAME-backend:latest
                else
                  echo "skipping backend image push"
                fi
                ''', returnStdout: true
                )
            }
        }
        
        stage('deploy') {
                agent {
                    kubernetes {
                      yaml '''
                        apiVersion: v1
                        kind: Pod
                        spec:
                          containers:
                          - name: helm
                            image: alpine/helm:3.11.1
                            command:
                            - cat
                            tty: true
                        '''
                        }
            }
            steps{
                container('helm') {
                sh script: '''
                curl -LO https://storage.googleapis.com/kubernetes-release/release/\$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
                chmod +x ./kubectl
                if ./kubectl get namespace $NAMESPACE > /dev/null 2>&1; then
                  echo "Namespace $NAMESPACE already exists"
                  if [[ $BUILD_BACKEND == true ]]; then
                    ./kubectl rollout restart deploy/$APP_NAME-backend-deploy -n $NAMESPACE
                  else
                    echo "skipping kubectl rollout for backend"
                  fi
                  sleep 5
                  if [[ $BUILD_FRONTEND == true ]]; then
                    ./kubectl rollout restart deploy/$APP_NAME-frontend-deploy -n $NAMESPACE
                  else
                    echo "skipping kubectl rollout for frontend"
                  fi
                else
                  echo "Namespace $NAMESPACE does not exist; deploy using helm"
                  ./kubectl create ns $NAMESPACE
                  git clone https://github.com/sktrinh12/helm-basic-app-chart.git
                  cd helm-basic-app-chart
                  if [[ $BUILD_BACKEND == true ]]; then
                    helm install k8sapp-$APP_NAME-backend . --namespace $NAMESPACE --set service.namespace=$NAMESPACE \
                    --set service.port=80 --set service.targetPort=8000 --set nameOverride=$APP_NAME-backend \
                    --set fullnameOverride=$APP_NAME-backend --set namespace=${NAMESPACE} \
                    --set image.repository=${AWSID}.dkr.ecr.us-west-2.amazonaws.com/$APP_NAME-backend \
                    --set image.tag=latest --set containers.name=fastapi \
                    --set containers.ports.containerPort=8000 --set app=fileupmap \
                    --set terminationGracePeriodSeconds=10
                  else
                    echo "skipping helm install of backend"
                  fi
                  sleep 2
                  if [[ $BUILD_FRONTEND == true ]]; then
                    helm install k8sapp-$APP_NAME-frontend . --namespace $NAMESPACE --set service.namespace=$NAMESPACE \
                    --set service.port=80 --set service.targetPort=80 --set nameOverride=$APP_NAME-frontend \
                    --set fullnameOverride=$APP_NAME-frontend --set namespace=${NAMESPACE} \
                    --set image.repository=${AWSID}.dkr.ecr.us-west-2.amazonaws.com/$APP_NAME-frontend \
                    --set image.tag=latest --set containers.name=react \
                    --set containers.ports.containerPort=80 --set app=fileupmap \
                    --set terminationGracePeriodSeconds=10 \
                    --set containers.volumeMounts.name=fileupmap-config-volume \
                    --set containers.volumeMounts.mountPath='/usr/share/nginx/html/config.js' \
                    --set containers.volumeMounts.subPath=config.js \
                    --set "volumes.name=fileupmap-config-volume" \
                    --set "volumes.configMapName=fileupmap-config-map"

                    # couldn't get --set cmd to provision configmap; but upgrade after seems to work
                    helm upgrade k8sapp-$APP_NAME-frontend . --namespace $NAMESPACE --reuse-values \
                    --set configValues="window.REACT_APP_BACKEND_URL='http://fileupmap.backend.kinnate'\nwindow.REACT_APP_ENVIRONMENT='PROD'"
                  else
                    echo "skipping helm install of frontend"
                  fi
                fi
                '''

            }
        }
    }
    
    stage ('purge ecr untagged images') {
            steps {
                withCredentials([aws(credentialsId: 'awscredentials', region: 'us-west-2')]) {
                    loop_ecr_purge(apps)
                }
            }
        }
        
    
    }
}

def loop_ecr_purge(list) {
    for (int i = 0; i < list.size(); i++) {
        sh """aws ecr list-images \
        --repository-name $APP_NAME-${list[i]} \
        --filter 'tagStatus=UNTAGGED' \
        --query 'imageIds[].imageDigest' \
        --output json \
        | jq -r '.[]' \
        | xargs -I{} aws ecr batch-delete-image \
        --repository-name $APP_NAME-${list[i]} \
        --image-ids imageDigest={} 
        """
        sh 'sleep 1'
    }
}
