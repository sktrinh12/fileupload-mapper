from fastapi import File, UploadFile, FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# from starlette.responses import FileResponse
from fastapi.responses import StreamingResponse
from .functions import parse_xlsx, parse_generic, pd
import io
import xlsxwriter

app = FastAPI()

excel_file = io.BytesIO()

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
async def upload(
    cro: str = Form(default=""),
    project: str = Form(default=""),
    files: List[UploadFile] = File(...),
):

    df_list = []
    contents = [file.filename for file in files]
    # print(files[0])
    for file in files:
        # print(file.filename)
        try:
            if file.filename.endswith(".xlsx"):
                df = await parse_xlsx(file)
                df_list.append(df)
            else:
                df = parse_generic(file, cro, project)
            # Generate Excel file as byte stream
            if file.filename.endswith(".xlsx"):
                df = pd.concat(df_list, ignore_index=True)
            with pd.ExcelWriter(excel_file, engine="xlsxwriter") as writer:
                df.to_excel(writer, index=False)
        except Exception as e:
            raise HTTPException(status_code=404, detail=e)
    return {"status": "Successfully uploaded", "contents": contents}


@app.get("/download")
async def download():
    excel_file.seek(0)
    return StreamingResponse(
        excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
