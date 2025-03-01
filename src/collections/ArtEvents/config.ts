import type { CollectionConfig } from 'payload'
import { formatSlug } from './fieldHooks'
import type { Field } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import {
  FixedToolbarFeature,
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
} from '@payloadcms/richtext-lexical'
import { customHTMLConverter } from './converters'
import { getImageSize } from 'next/dist/server/image-optimizer'

const checkDuplicate = async (value: any, { req, data }: any): Promise<any> => {
  const collec = await req.payload.find({
    collection: 'art_events',
  })
  const duplicate = collec.docs.some(
    (item: any) => data.title == item.title && data.time == item.time && item.id != data.id,
  )

  // console.log(value, '   ', duplicate)

  return !duplicate || 'Changez le Titre ou la date'
}

const EventId: Field = {
  name: 'event_id',
  type: 'text',
  defaultValue: uuidv4(),
  required: true,
  // unique: true,
  admin: {
    readOnly: true,
  },
  hooks: {
    beforeValidate: [() => uuidv4()],
  },
}

export const ArtEvents: CollectionConfig = {
  slug: 'art_events',
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },

  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      label: 'Infos evenement',
      type: 'collapsible',

      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titre',
          required: true,
          validate: checkDuplicate,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'time',
              label: 'Date et heure de debut',
              type: 'date',
              required: true,
              validate: checkDuplicate,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  overrides: {
                    locale: 'fr-FR',
                  },
                  timeFormat: 'HH:mm',
                },
              },
            },
            {
              name: 'place',
              label: 'Salle/espace/adresse',
              type: 'text',
              required: true,
            },
            {
              name: 'city',
              label: 'Ville',
              type: 'text',
              required: true,
            },
          ],
        },

        {
          type: 'row',
          fields: [
            {
              name: 'type',
              label: "Type d'evenement",
              type: 'select',
              options: [
                { label: 'Musique', value: 'musique' },
                { label: 'Exposition', value: 'expo' },
                { label: 'Festival', value: 'festival' },
                { label: 'Atelier', value: 'atelier' },
                { label: 'Projection', value: 'projection' },
              ],
              required: true,
            },
            {
              name: 'price',
              label: 'Prix',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'flyerExternal',
          label: 'Lien image externe',
          type: 'text',
        },
        {
          name: 'flyerInternal',
          label: 'Upload image ',
          admin: {
            description:
              'dimensions max 1440*1440, seulement si pas de lien externe ou si preference ',
          },
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      label: 'Details',
      type: 'collapsible',
      fields: [
        {
          type: 'checkbox',
          label: 'Dexcription interne ?',
          name: 'internEvent',
          defaultValue: false,
        },
        {
          name: 'link',
          label: 'Lien vers le detail',
          type: 'text',
          required: true,
          admin: {
            condition: (data) => {
              if (data.internEvent) return false
              return true
            },
          },
        },
        {
          label: 'Description',
          name: 'description',
          type: 'text',
          required: true,
          admin: {
            condition: (data) => {
              if (data.internEvent) return true
              return false
            },
          },
        },
        {
          name: 'text_body',
          label: "Details de l'event",
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              FixedToolbarFeature(),
              HTMLConverterFeature({
                converters: [customHTMLConverter],
              }),
            ],
          }),
          admin: {
            condition: (data) => {
              if (data.internEvent) return true
              return false
            },
          },
        },

        lexicalHTML('text_body', { name: 'text_body_html' }),
      ],
    },

    {
      label: 'MetaDonnees',
      type: 'collapsible',
      admin: { initCollapsed: true },
      fields: [
        EventId,
        {
          name: 'slug',
          type: 'text',
          required: true,
          // unique: true,
          validate: checkDuplicate,
          hooks: {
            // beforeDuplicate: [formatSlug],
            beforeValidate: [formatSlug],
          },
          admin: {
            description: 'videz la case pour generer le slug automatiquement au publish',
          },
        },

        {
          name: 'canceled',
          label: 'event annule ?',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
