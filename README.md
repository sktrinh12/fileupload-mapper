## file upload mapper

# Instructions

Refer to Local build runs for a local install. If pushing to the cloud, the app can be initially deployed manually using console (Helm) and then using Jenkins CI tool for future changes. 

## Local build and run

To locally run the application run the following simple commands. Ensure you have `python 3` and `npm` installed. 

```
# open a new terminal
cd /path/to/backend
python main.py

# in separate terminal
cd /path/to/frontend
npm run start
```

## Cloud build (Docker/k8s)

### **Frontend:**

- `docker build -t ${AWS_ID}.dkr.ecr.us-west-2.amazonaws.com/fileupload-mapper-frontend -f Dockerfile .`
- `ecrpush ${AWS_ID}.dkr.ecr.us-west-2.amazonaws.com/fileupload-mapper-frontend`
- `kubectl rollout restart deploy/frontend-deploy -n fileupmap`

### **Backend:**

- `docker build -t ${AWS_ID}.dkr.ecr.us-west-2.amazonaws.com/fileupload-mapper-backend -f Dockerfile .`
- `ecrpush ${AWS_ID}.dkr.ecr.us-west-2.amazonaws.com/fileupload-mapper-backend`
- `kubectl rollout restart deploy/backend-deploy -n fileupmap`

`${AWS_ID}` is the AWS unique ID number that is used to log-in to the AWS console

## **Additional Commands:**

These commands use Helm, which allows for templated yaml files (charts) which can be version controlled. The repo is: https://github.com/Kinnate/k8s-app-helm.git. If using helm, no need to run the kubectl from above.

- `helm install k8sapp-fileupload-mapper-frontend . --set service.namespace=fileupmap --set service.port=3000 --set service.targetPort=80 --set nameOverride=frontend --set fullnameOverride=frontend --set namespace=fileupmap --set image.repository=$(cat ~/Documents/security_files/aws-console).dkr.ecr.us-west-2.amazonaws.com/fileupload-mapper-frontend --set image.tag=latest --set containers.name=react --set containers.ports.containerPort=3000 --set app=fileupmap --set data.properties=test --set containers.volumeMounts.name=fileupmap-config-volume --set containers.volumeMounts.mountPath='/usr/share/nginx/html/config.js' --set containers.volumeMounts.subPath=config.js --set terminationGracePeriodSeconds=10 --set "volumes.name=fileupmap-config-volume" --set "volumes.configMapName=fileupmap-config-map" --values ./config-values/config-prod.yaml`
- use of a `ConfigMap` k8s resource in order for the react app be aware of environmental variables. This creates a `configMap`, which you can then reference by the `config.js` key and the content are the environment variables. within `helm`, you can override default values using `--values` and point to the file path of the `.yaml` file that contains the environmental variables. If using the classical `LoadBalancer` then keep `service.port` and `service.targetPort` to 3000, otherwise the network `LoadBalancer` uses nginx as a reverse-proxy, and thus these ports should be set to 80. 
- `helm install k8sapp-fileupload-mapper-backend . --set service.namespace=fileupmap --set service.port=8000 --set service.targetPort=8000 --set nameOverride=backend --set fullnameOverride=backend --set namespace=fileupmap --set image.repository=$(cat ~/Documents/security_files/aws-console).dkr.ecr.us-west-2.amazonaws.com/fileupload-mapper-backend --set image.tag=latest --set containers.name=fastapi --set containers.ports.containerPort=8000 --set app=fileupmap` An existing chart can be edited/adjusted by using the `--reuse-values` flag. 
- `helm upgrade k8sapp-fileupmap-mapper-frontend . --reuse-values --set service.type=LoadBalancer` *if you want to update some values
- you can use `-dry-run` and/or `-debug` and/or `-disable-openapi-validation` to ensure the chart works by inspecting the output.

## Integration

Once the app is running on the k8s cluster, point to the Network LB, for both frontend and backend using Route 53. Afterwards, Create a button within the `STUDIES_FORM` project under `Exerpiment_Uploads` form. Add the url of the AWS Route 53 frontend application as the link of the button. In order to change the URL link to the front/back-end application, one must configure the `config.js` file within the react app application. This is abstracted by `ConfigMap` k8s resource which is achieved through the `config-prod.yaml` file.
