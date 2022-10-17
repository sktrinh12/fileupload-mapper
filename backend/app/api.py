from fastapi import File, UploadFile, FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from starlette.responses import FileResponse
import pandas as pd


app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload")
def upload(cro: str = Form(), project: str = Form(), files: List[UploadFile] = File(...)):
    lst = []

    for file in files:
        try:
            doc, num, suffix = file.filename.split('-')
            batch = f"{num}-{suffix.split('.')[0]}"
            lst.append([num, batch, file.filename, doc, cro, project])
            df = pd.DataFrame(lst, columns=[
                                'Compound_ID',
                                'Batch_ID',
                                'Filename',
                                'Doc_type',
                                'CRO',
                                'Project'
                                ])

            print(df)
            df.to_excel("file_mapping.xlsx", index=False)
        except Exception:
            return {"status": "There was an error uploading the file(s)"}
    contents = [file.filename for file in files]
    return {"status":"Successfully uploaded",
            "contents": contents}


@app.get("/download")
def download():
    file_name = "file_mapping.xlsx"
    return FileResponse(file_name,
                        media_type='application/octet-stream',
                        filename=file_name)
