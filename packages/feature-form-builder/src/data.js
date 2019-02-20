const data = {
  steps: [
    {
      stepname: "Layout",
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
              fieldid: "f01",
              blockid: "ba",
              cbfield: "assetname",
              sequence: "1",
              label: "Asset Name asdasdasd"
            },
            {
              fieldid: "f02",
              blockid: "ba",
              cbfield: "serailno",
              sequence: "2",
              label: "Asset Serial Number"
            },
            {
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
                      fieldid: "f01",
                      blockid: "ba",
                      cbfield: "assetname",
                      sequence: "1",
                      label: "Document name"
                    },
                    {
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
                      fieldid: "f01",
                      blockid: "ba",
                      cbfield: "assetname",
                      sequence: "1",
                      label: "Asset Name"
                    },
                    {
                      fieldid: "f02",
                      blockid: "ba",
                      cbfield: "serailno",
                      sequence: "2",
                      label: "Asset Serial Number"
                    },
                    {
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
