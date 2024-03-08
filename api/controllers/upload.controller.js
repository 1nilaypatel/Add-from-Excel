import Candidate from '../models/candidate.model.js';
import XLSX from 'xlsx';
import multer from 'multer';
import async from 'async';
import path from 'path';

export const getCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

export const handleUpload = upload.single("xlsx");

export const uploadCandidates = async (req, res) => {
  try {
    let path = req.file.path;
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sheet has no data",
      });
    }

    let count = 0;
    let duplicateCount = 0;
    async.eachSeries(jsonData, (item, callback) => {
      Candidate.findOne({
        Email: item.Email
      }).count(function(err, num) {
        if (num > 0) {
          duplicateCount++;
          console.log(`Skipping duplicate item: ${item['Email']}`);
          return callback();
        }

        const candidate = new Candidate(item);
        candidate.save(function(err) {
          if (!err) count++;
          callback(err);
        });
      });
    }, (err) => {
      if (err) {
        console.error(err);
      } else {
        let message = (count === 0) ? 'No unique items found!' : `${count} unique items saved successfully!`;
        message += (duplicateCount === 1) ? '  1 duplicate!' : `  ${duplicateCount} duplicates!`;

        console.log(`${count} unique items saved successfully!`);
        return res.status(201).json({
          success: true,
          message: message
        });
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};