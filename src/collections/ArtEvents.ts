import type { CollectionConfig } from 'payload'
import type { Field } from 'payload'
import { v4 as uuidv4 } from 'uuid'

const EventId: Field = {
  name: 'event_id',
  type: 'text',
  defaultValue: uuidv4(),
  required: true,
  admin: {
    readOnly: true,
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
    }, // Permet la lecture publique
  },

  versions: {
    drafts: {
      autosave: true,

      // Alternatively, you can specify an `interval`:
      // autosave: {
      //   interval: 1500,
      // },
    },
  },
  fields: [
    EventId,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      label: "lien vers l'event",
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      label: 'event type',
      type: 'select',
      options: [
        { label: 'Musique', value: 'musique' },
        { label: 'Exposition', value: 'expo' },
        { label: 'Festival', value: 'festival' },
        { label: 'Atelier', value: 'atelier' },
      ],
      required: true,
    },
    {
      name: 'time',
      label: 'Quand ca commence',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'price',
      type: 'text',
      required: true,
    },
    {
      name: 'place',
      label: "ou que c'est comme endroit ?",
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      label: "c'est dans quelle ville ?",
      type: 'text',
      required: true,
    },
    {
      name: 'flyerExternal',
      label: "lien de l'image (si y'en a une)",
      type: 'text',
    },
    {
      name: 'flyerInternal',
      label: "charge une image (si y'en a pas de liens)",
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
