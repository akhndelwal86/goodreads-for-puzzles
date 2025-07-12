// Field mapping from JSON to DB schema for puzzle import

export const FIELD_MAPPING = {
  // Direct mappings
  'puzzle_name': 'title',
  'num_pieces': 'piece_count',
  'description': 'description',
  'product_url': 'purchase_link',
  'article_num': 'sku',
  'ean': 'ean',
  'barcode': 'barcode',
  'price': 'price',
  // Complex mappings
  'brand': 'brand_id', // needs resolution
  'image_urls': 'image_url', // take first image
  'box_dimensions': ['box_width', 'box_height', 'box_depth'], // parse
  'puzzle_dimensions': ['finished_size_width', 'finished_size_height'], // parse
  'age': ['age_range_min', 'age_range_max'] // parse
};

export const DEFAULT_VALUES = {
  approval_status: 'pending',
  created_at: 'NOW()',
  updated_at: 'NOW()',
  material: null,
  year: null,
  theme: null,
  surface_finish: null,
  included_items: null,
  key_features: null,
  weight_grams: null
}; 