class BrandResolver {
  constructor(supabase) {
    this.supabase = supabase;
    this.cache = new Map();
  }

  async resolveBrand(brandName) {
    if (!brandName) return null;
    if (this.cache.has(brandName)) {
      return this.cache.get(brandName);
    }
    // Check if brand exists
    const { data: existingBrand } = await this.supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
      .single();
    if (existingBrand && existingBrand.id) {
      this.cache.set(brandName, existingBrand.id);
      return existingBrand.id;
    }
    // Create new brand
    const { data: newBrand, error: insertError } = await this.supabase
      .from('brands')
      .insert({ name: brandName })
      .select('id')
      .single();
    if (insertError || !newBrand) {
      throw new Error(`Failed to create brand ${brandName}: ${insertError?.message}`);
    }
    this.cache.set(brandName, newBrand.id);
    return newBrand.id;
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      brands: Array.from(this.cache.keys())
    };
  }
}

export default BrandResolver; 