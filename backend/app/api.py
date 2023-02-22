from fastapi import File, UploadFile, FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from starlette.responses import FileResponse
from os import getenv
import pandas as pd

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://fileupmap.frontend.kinnate",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload")
def upload(
    cro: str = Form(), project: str = Form(), files: List[UploadFile] = File(...)
):
    lst = []

    for file in files:
        try:
            doc, num, suffix = file.filename.split("-")
            batch = f"{num}-{suffix.split('.')[0]}"
            lst.append([num, batch, file.filename, doc, cro, project])
            df = pd.DataFrame(
                lst,
                columns=[
                    "Compound_ID",
                    "Batch_ID",
                    "Filename",
                    "Doc_type",
                    "CRO",
                    "Project",
                ],
            )

            print(df)
            directory = getenv("PARENT_DIR", "") + ("/" if getenv("PARENT_DIR") else "")
            # with open('test', 'w') as f:
            #     f.write(batch + '\n')
            df.to_excel(f"{directory}file_mapping.xlsx", index=False)
        except Exception as e:
            return {"status": f"There was an error uploading the file(s) - {e}"}
    contents = [file.filename for file in files]
    return {"status": "Successfully uploaded", "contents": contents}


@app.get("/download")
def download():
    file_name = "file_mapping.xlsx"
    return FileResponse(
        file_name, media_type="application/octet-stream", filename=file_name
    )
