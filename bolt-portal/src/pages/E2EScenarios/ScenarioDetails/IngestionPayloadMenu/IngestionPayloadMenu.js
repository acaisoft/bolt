/**
 * Copyright (c) 2022 Acaisoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useCallback, useState} from 'react'

import { IconButton, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { MoreVert, Code } from '@material-ui/icons'
import { CopyToClipboard, PopoverMenu } from 'components'
import { useNotification } from 'hooks'
import { CurlyBraces, Terminal } from "assets/icons";
import PreviewPayloadModal from "./PreviewPayloadModal";

function IngestionPayloadMenu({ scenarioId, projectId }) {
  const notify = useNotification()

  const [previewModalState, togglePreviewModal] = useState({open: false, data: ''})

  const getJSONPayload = () => {
    return JSON.stringify(
          {
            "scenario_id": scenarioId,
            "project_id": projectId,
            "custom_fields": {},
            "report_format": "JUNITXML"
          }, null, 2)
  }

  const handleGenerate = (dataType) => {
    switch(dataType) {
      case "JSON":
        return getJSONPayload()
      case "CURL":
        return "curl --request POST \\\n" +
          "  --url " + `${process.env.REACT_APP_API_SERVICE_BASE_URL}/external_tests/upload_external_tests` + " \\\n" +
          "  --header 'Content-Type: multipart/form-data' \\\n" +
          "  --form 'data=" + getJSONPayload() +"' \\\n" +
          "  --form file="
    }
  }

  return (
    <React.Fragment>
      <PopoverMenu
        data-testid="ExecutionActions"
        id="generate-ingestion-payload"
        closeOnClick
        trigger={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
      >
        <MenuItem
          onClick={() => togglePreviewModal({open: true, data: "JSON"})}
          title="JSON payload"
        >
          <ListItemIcon>
            <CurlyBraces />
          </ListItemIcon>
          <ListItemText>Get JSON payload</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => togglePreviewModal({open: true, data: "CURL"})}
          title="ingestion CURL"
        >
          <ListItemIcon>
            <Terminal />
          </ListItemIcon>
          <ListItemText>Get ingestion CURL</ListItemText>
        </MenuItem>
      </PopoverMenu>
      <PreviewPayloadModal
        isOpen={previewModalState.open}
        onClose={() => togglePreviewModal({open: false, data: ""})}
      >
        <CopyToClipboard
          text={handleGenerate(previewModalState.data)}
          label={previewModalState.data}
          margin="normal"
          variant="filled"
          multiline
          fullWidth
        />
      </PreviewPayloadModal>
    </React.Fragment>
  )
}

export default IngestionPayloadMenu
