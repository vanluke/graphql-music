import React, { FunctionComponent } from 'react';
import * as Yup from 'yup';
import { withFormik, FormikProps } from 'formik';

type SongCreationValues = {
  title: string;
  video_url: string;
};

const SongSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  video_url: Yup.string()
    .url('Invalid url address')
    .required('Required'),
});

const SongCreation: FunctionComponent<FormikProps<SongCreationValues>> = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.title}
        name="title"
      />
      {errors.title && touched.title && (
        <div className="feedback">{errors.title}</div>
      )}
      <input
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.video_url}
        name="video_url"
      />
      {errors.video_url && touched.video_url && (
        <div className="feedback">{errors.video_url}</div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

type IncomingSongCreationProps = {
  onCreateSong: (values: SongCreationValues) => Promise<void>;
};

export default withFormik<IncomingSongCreationProps, SongCreationValues>({
  validationSchema: SongSchema,

  handleSubmit: (values, { setSubmitting, props }) => {
    setSubmitting(true);

    props
      .onCreateSong(values as SongCreationValues)
      .then(() => {
        setSubmitting(false);
      })
      .catch((error: Error) => {
        setSubmitting(false);
      });
  },

  displayName: 'Create Song form',
})(SongCreation);
