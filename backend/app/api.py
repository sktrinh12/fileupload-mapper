from fastapi import FastAPI, Response, Request, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pandas as pd
from datetime import datetime

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


parent_path = Path(f'{Path.home()}/{args.path[0]}')
files = list(parent_path.glob(f'*{args.ft[0]}*'))
today = datetime.now() # current date and time
today = today.strftime("%Y_%b_%d").upper()
ftnum = 'FT'
lst = []

tmp_num = str(args.ft[0])

for i in range(8-len(tmp_num)-2):
    ftnum += '0'

ftnum += tmp_num
print(ftnum)


for f in files:
    doc, num, suffix = f.name.split('-')
    batch = f"{num}-{suffix.split('.')[0]}"
    lst.append([ftnum, batch, f.name, doc, args.cro[0], args.proj[0]])

df = pd.DataFrame(lst, columns=[
                                'Compound_ID',
                                'Batch_ID',
                                'Filename',
                                'Doc_type',
                                'CRO',
                                'Project'
                                ]
                  )

# print(df)

df.to_excel(f"{parent_path}/file_mapping_output_{today}.xlsx",
            index = False)
