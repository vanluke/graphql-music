import React, { FunctionComponent } from 'react';
import {
  Song as SongType,
  Artist as ArtistType,
  Thumbnails as ThumbnailsType,
} from './Songs';
import * as Yup from 'yup';
import { withFormik, FormikProps } from 'formik';

type SongEditValues = SongType;

const SongSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  video_url: Yup.string()
    .url('Invalid url address')
    .required('Required'),
  artist: Yup.object({
    id: Yup.number().required(),
    surname: Yup.string().required(),
    nickname: Yup.string().required(),
    first_name: Yup.string().required(),
  }),
  thumbnails: Yup.object({
    id: Yup.number().required(),
    desktop_url: Yup.string().required(),
    mobile_url: Yup.string().required(),
    tablet_url: Yup.string().required(),
  }),
});

const SongEdit: FunctionComponent<FormikProps<SongEditValues> & {
  onDelete: () => void;
  artists: ArtistType[];
  thumbnails: ThumbnailsType[];
}> = ({
  artists,
  thumbnails,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  onDelete,
  setFieldValue,
}) => {
  const handleArtistChange = (
    value: React.SyntheticEvent<HTMLSelectElement>
  ) =>
    setFieldValue(
      'artist',
      extractTypename(
        artists.find(
          item => item.id === parseInt(value.currentTarget.value, 10)
        )
      )
    );
  const handleThumbnailsChange = (
    value: React.SyntheticEvent<HTMLSelectElement>
  ) =>
    setFieldValue(
      'thumbnails',
      extractTypename(
        thumbnails.find(
          item => item.id === parseInt(value.currentTarget.value, 10)
        )
      )
    );
  return (
    <>
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
        <label htmlFor="artist">Artist</label>
        <select
          name="artist"
          defaultValue={values.artist.id}
          onChange={handleArtistChange}
          onBlur={handleArtistChange}
        >
          {artists.map((item: ArtistType) => (
            <option key={item.id} value={item.id}>
              {item.first_name} {item.surname} ({item.nickname})
            </option>
          ))}
        </select>
        <label htmlFor="thumbnails">Thumbnails Group</label>
        <select
          name="thumbnails"
          defaultValue={values.thumbnails.id}
          onChange={handleThumbnailsChange}
          onBlur={handleThumbnailsChange}
        >
          {thumbnails.map((item: ThumbnailsType) => (
            <option key={item.id} value={item.id}>
              {item.id}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
        <label>
          Thumbnails
          <div>
            Desktop:
            <img src={values.thumbnails.desktop_url} alt="desktop" />
            Tablet:
            <img src={values.thumbnails.tablet_url} alt="tablet" />
            Mobile:
            <img src={values.thumbnails.mobile_url} alt="mobile" />
          </div>
        </label>
      </form>
      <button onClick={onDelete}>Delete</button>
    </>
  );
};

type IncomingSongEditProps = {
  onEditSave: (values: SongEditValues) => Promise<void>;
  onDelete: () => void;
  song: SongType;
  artists: ArtistType[];
  thumbnails: ThumbnailsType[];
};

export default withFormik<IncomingSongEditProps, SongEditValues>({
  enableReinitialize: true,
  mapPropsToValues: (props: IncomingSongEditProps) => ({
    title: props.song.title,
    video_url: props.song.video_url,
    ...props.song,
  }),

  validationSchema: SongSchema,

  handleSubmit: (values, { setSubmitting, props }) => {
    setSubmitting(true);
    props
      .onEditSave(parseRequestPayload(values) as SongEditValues)
      .then(() => {
        setSubmitting(false);
      })
      .catch((error: Error) => {
        setSubmitting(false);
      });
  },

  displayName: 'Edit Song form',
})(SongEdit);

function extractTypename(value: any & { __typename: string }) {
  const { __typename, ...rest } = value;
  return Object.assign({}, rest);
}

function parseRequestPayload(
  value: any & {
    artist: {
      __typename: string;
    };
    thumbnails: {
      __typename: string;
    };
  }
) {
  const { artist, thumbnails, ...rest } = value;

  return Object.assign({}, rest, {
    artist: extractTypename(artist),
    thumbnails: extractTypename(thumbnails),
  });
}
