import { FIELD_MAPPING, DEFAULT_VALUES } from './config-field-mapping.js';
import { processPuzzleImage } from './image-processor.js';

class DataProcessor {
  constructor(brandResolver, supabase, dryRun = false) {
    this.brandResolver = brandResolver;
    this.supabase = supabase;
    this.dryRun = dryRun;
  }

  async processPuzzle(rawData) {
    const processed = { ...DEFAULT_VALUES };
    for (const [jsonField, dbField] of Object.entries(FIELD_MAPPING)) {
      if (rawData[jsonField] !== undefined) {
        await this.processField(jsonField, dbField, rawData[jsonField], processed, rawData);
      }
    }
    return processed;
  }

  async processField(jsonField, dbField, value, processed, rawData) {
    switch (jsonField) {
      case 'brand':
        processed.brand_id = await this.brandResolver.resolveBrand(value);
        break;
      case 'image_urls': {
        const imageUrl = Array.isArray(value) ? value[0] : value;
        processed.image_url = await processPuzzleImage(imageUrl, rawData.id || rawData.title || 'unknown', this.supabase, this.dryRun);
        break;
      }
      case 'box_dimensions': {
        const boxDims = this.parseDimensions(value);
        processed.box_width = boxDims.width;
        processed.box_height = boxDims.height;
        processed.box_depth = boxDims.depth;
        break;
      }
      case 'puzzle_dimensions': {
        const puzzleDims = this.parseDimensions(value);
        processed.finished_size_width = puzzleDims.width;
        processed.finished_size_height = puzzleDims.height;
        break;
      }
      case 'age': {
        const ageRange = this.parseAgeRange(value);
        processed.age_range_min = ageRange.min;
        processed.age_range_max = ageRange.max;
        break;
      }
      default:
        processed[dbField] = value;
    }
  }

  parseDimensions(dimString) {
    if (!dimString) return { width: null, height: null, depth: null };
    const matches = dimString.match(/(\d+\.?\d*)/g);
    return {
      width: matches && matches[0] ? parseFloat(matches[0]) : null,
      height: matches && matches[1] ? parseFloat(matches[1]) : null,
      depth: matches && matches[2] ? parseFloat(matches[2]) : null
    };
  }

  parseAgeRange(ageString) {
    // Parse e.g. "7 - 99"
    const matches = ageString.match(/(\d+)/g);
    return {
      min: matches && matches[0] ? parseInt(matches[0]) : null,
      max: matches && matches[1] ? parseInt(matches[1]) : (matches && matches[0] ? parseInt(matches[0]) : null)
    };
  }
}

export default DataProcessor; 