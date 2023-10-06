import React from "react";
import axios from "axios";
import { useCSVReader } from "react-papaparse";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

const apipost = (res, tablename) => {
  axios
    .post("http://192.168.100.214:9000/brickapi/v1/mysql/insert1", {
      name: res,
      tablename: tablename,
    })
    .then(function (response) {
      console.log(response.data);
    });
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        //console.log("---------------------------");
        //console.log(results);
        apipost(results.data.map((ele) => ele[0]).slice(1), "haha2");
        //console.log("---------------------------");
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div style={styles.csvReader}>
            <button
              type="button"
              {...getRootProps()}
              style={styles.browseFile}
              className="btn btn-secondary btn-sm"
            >
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button
              {...getRemoveFileProps()}
              style={styles.remove}
              className="btn btn-secondary btn-sm"
            >
              Remove
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  );
}
