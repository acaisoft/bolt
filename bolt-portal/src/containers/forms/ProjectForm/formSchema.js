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

import { makeFlatValidationSchema, makeEmptyInitialValues } from 'utils/forms'

const createFormConfig = () => {
  const fields = {
    name: {
      validator: {
        presence: { allowEmpty: false },
        length: { minimum: 3 },
      },
      inputProps: {
        variant: 'filled',
        label: 'Name',
      },
    },
    description: {
      validator: {
        length: { maximum: 512 },
      },
      inputProps: {
        variant: 'filled',
        label: 'Description',
      },
    },
    // TODO: uncomment when upload will be needed
    // uploaded_image: {
    //   inputProps: {
    //     accept: 'image/png, image/jpeg, image/gif',
    //     label: 'Upload Image',
    //     id: 'project_image',
    //   },
    //   handlers: (form, input) => ({
    //     onStart: () =>
    //       form.form.mutators.setFieldData('uploaded_image', {
    //         started: true,
    //       }),
    //     onSuccess: info => form.form.change('image_url', info.download_url),
    //     onError: err => form.form.change('image_url', undefined),
    //     onLoad: fileAsDataUrl =>
    //       form.form.change('image_preview_url', fileAsDataUrl),
    //   }),
    // },
    // image_url: {},
    // image_preview_url: {},
  }

  const validationSchema = makeFlatValidationSchema(fields)
  const makeInitialValues = values => makeEmptyInitialValues(fields, values)

  return { fields, validationSchema, makeInitialValues }
}

export { createFormConfig }
