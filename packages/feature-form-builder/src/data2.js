const data = {
  steps: [
    {
      stepname: "Contacts",
      module: "Contacts",
      stepdesc: "New layout for Assets",
      stepid: 0,
      sequence: "1",
      nextaction: "Detail",
      nextsave: "TRUE",
      blocks: [
        {
          blockid: 0,
          label: "Main Data",
          sequence: "1",
          blocktype: "Fields",
          fields: [
            {
              uitype: 1,
              fieldid: "f01",
              blockid: "ba",
              cbfield: "firstname",
              sequence: "1",
              label: "Asset Name asdasdasd"
            },
            {
              uitype: 1,
              fieldid: "f02",
              blockid: "ba",
              cbfield: "lastname",
              sequence: "2",
              label: "Asset Serial Number"
            },
            {
              uitype: 56,
              fieldid: "f03",
              blockid: "bb",
              cbfield: "cf_999",
              sequence: "3",
              label: "Asset Image"
            },
            {
              uitype: 1,
              fieldid: "f02",
              blockid: "ba",
              cbfield: "lastname",
              sequence: "2",
              label: "Asset Serial Number"
            },
            {
              uitype: 1,
              fieldid: "f02",
              blockid: "ba",
              cbfield: "lastname",
              sequence: "2",
              label: "Asset Serial Number"
            },
            {
              uitype: 1,
              fieldid: "f02",
              blockid: "ba",
              cbfield: "lastname",
              sequence: "2",
              label: "Asset Serial Number"
            }
          ]
        },
        {
          blockid: 1,
          label: "Main Data2",
          sequence: "2",
          blocktype: "RowEdit",
          blockfields: [
            {
              blockfieldid: 1,
              fields: [
                {
                  uitype: 1,
                  fieldid: 1,
                  blockid: "ba2",
                  cbfield: "Input #1",
                  sequence: "1",
                  label: "Input #1"
                },
                {
                  uitype: 1,
                  fieldid: 2,
                  blockid: "ba",
                  cbfield: "Input #2",
                  sequence: "2",
                  label: "Input #2"
                },
                {
                  uitype: 1,
                  fieldid: 3,
                  blockid: "ba",
                  cbfield: "Input #1",
                  sequence: "1",
                  label: "Input #3"
                },
                {
                  uitype: 1,
                  fieldid: 4,
                  blockid: "ba",
                  cbfield: "Input #2",
                  sequence: "2",
                  label: "Input #4"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      stepname: "Document",
      stepdesc: "Attach Document",
      stepid: 2,
      sequence: "2",
      nextaction: "Detail",
      nextsave: "TRUE",
      blocks: [
        {
          label: "Attachment",
          sequence: "2",
          blocktype: "DocumentForm",
          fields: [
            {
              stepname: "Document Attachment",
              stepdesc: "New layout for Assets",
              stepid: 1,
              sequence: "1",
              nextaction: "Detail",
              nextsave: "TRUE",
              blocks: [
                {
                  label: "Document Upload",
                  sequence: "1",
                  blocktype: "Fields",
                  fields: [
                    {
                      uitype: 1,
                      fieldid: "f01",
                      blockid: "ba",
                      cbfield: "assetname",
                      sequence: "1",
                      label: "Document name"
                    },
                    {
                      uitype: 1,
                      fieldid: "f01",
                      blockid: "ba",
                      cbfield: "assetname",
                      sequence: "1",
                      label: "Upload file"
                    }
                  ]
                }
              ]
            },
            {
              stepname: "Document Fields ",
              stepdesc: "New layout for Assets",
              stepid: 2,
              sequence: "1",
              nextaction: "Detail",
              nextsave: "TRUE",
              blocks: [
                {
                  label: "Document Fields",
                  sequence: "1",
                  blocktype: "Fields",
                  fields: [
                    {
                      uitype: 1,
                      fieldid: "f01",
                      blockid: "ba",
                      cbfield: "assetname",
                      sequence: "1",
                      label: "Asset Name"
                    },
                    {
                      uitype: 1,
                      fieldid: "f02",
                      blockid: "ba",
                      cbfield: "serailno",
                      sequence: "2",
                      label: "Asset Serial Number"
                    },
                    {
                      uitype: 1,
                      fieldid: "f03",
                      blockid: "bb",
                      cbfield: "cf_999",
                      sequence: "3",
                      label: "Asset Image"
                    }
                  ]
                },
                {
                  blockid: 1,
                  label: "Main Data2",
                  sequence: "2",
                  blocktype: "RowEdit",
                  fields: [
                    {
                      fieldid: 1,
                      blockid: "ba",
                      cbfield: "Input #1",
                      sequence: "1",
                      label: "Input #1"
                    },
                    {
                      fieldid: 2,
                      blockid: "ba",
                      cbfield: "Input #2",
                      sequence: "2",
                      label: "Input #2"
                    },
                    {
                      fieldid: 3,
                      blockid: "ba",
                      cbfield: "Input #1",
                      sequence: "1",
                      label: "Input #3"
                    },
                    {
                      fieldid: 4,
                      blockid: "ba",
                      cbfield: "Input #2",
                      sequence: "2",
                      label: "Input #4"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default data;
