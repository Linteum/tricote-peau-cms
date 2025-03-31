import { CollectionConfig } from 'payload'

export const ArtOrgs: CollectionConfig = {
  slug: 'art_orgs',
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
      name: 'name',
      label: 'Nom du contact',
      type: 'text',
      required: true,
      unique: true,
    },
    { name: 'website', label: 'site internet', type: 'text', required: true },
    {
      name: 'category',

      label: 'Type de contact',
      type: 'select',
      options: [
        { label: 'Lieu', value: 'lieu' },
        { label: 'Asso', value: 'association' },
        { label: 'Plateforme', value: 'plateforme' },
        { label: 'Outil', value: 'outil' },
      ],
      required: true,
    },
    {
      name: 'subcategory',
      label: 'Sous categories',
      type: 'text',
    },
    {
      name: 'city',
      label: 'Ville',
      type: 'text',
    },
    {
      name: 'canceled',
      label: "n'existe plus ?",
      type: 'checkbox',
    },
  ],
}
