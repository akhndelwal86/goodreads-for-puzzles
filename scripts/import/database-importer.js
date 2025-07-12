class DatabaseImporter {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async importPuzzle(puzzle, skipExisting = true) {
    // Check for existing puzzle by SKU or EAN
    if (skipExisting && (puzzle.sku || puzzle.ean)) {
      const query = this.supabase.from('puzzles').select('id');
      if (puzzle.sku) query.eq('sku', puzzle.sku);
      if (puzzle.ean) query.eq('ean', puzzle.ean);
      const { data: existing } = await query.single();
      if (existing && existing.id) {
        return { imported: false, skipped: true, reason: 'already exists', id: existing.id };
      }
    }
    // Insert puzzle
    const { data, error } = await this.supabase.from('puzzles').insert([puzzle]).select('id').single();
    if (error) {
      return { imported: false, skipped: false, error: error.message };
    }
    return { imported: true, skipped: false, id: data.id };
  }
}

export default DatabaseImporter; 