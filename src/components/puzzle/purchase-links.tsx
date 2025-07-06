'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ExternalLink, Plus, ShoppingCart, DollarSign, Star, Verified } from 'lucide-react'

interface PurchaseLink {
  id: string
  url: string
  retailer: string
  price?: number | null
  currency: string
  added_by: string
  verified: boolean
  created_at: string
}

interface PurchaseLinksProps {
  puzzleId: string
  puzzleTitle: string
}

export function PurchaseLinks({ puzzleId, puzzleTitle }: PurchaseLinksProps) {
  const [links, setLinks] = useState<PurchaseLink[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for adding new link
  const [newLink, setNewLink] = useState({
    url: '',
    retailer: '',
    price: '',
    currency: 'USD'
  })

  useEffect(() => {
    fetchPurchaseLinks()
  }, [puzzleId])

  const fetchPurchaseLinks = async () => {
    try {
      const response = await fetch(`/api/puzzles/${puzzleId}/purchase-links`)
      if (response.ok) {
        const data = await response.json()
        setLinks(data.purchaseLinks || [])
      }
    } catch (error) {
      console.error('Error fetching purchase links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/puzzles/${puzzleId}/purchase-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLink),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Purchase link added:', data.message)
        
        // Refresh the links
        await fetchPurchaseLinks()
        
        // Reset form and close modal
        setNewLink({ url: '', retailer: '', price: '', currency: 'USD' })
        setIsAddModalOpen(false)
      } else {
        const error = await response.json()
        console.error('❌ Failed to add purchase link:', error.error)
      }
    } catch (error) {
      console.error('❌ Network error adding purchase link:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRetailerIcon = (retailer: string) => {
    const name = retailer.toLowerCase()
    if (name.includes('amazon')) return '📦'
    if (name.includes('target')) return '🎯'
    if (name.includes('walmart')) return '🛒'
    if (name.includes('barnes')) return '📚'
    return '🛍️'
  }

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="w-full h-16 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-emerald-600" />
            Where to Buy
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Find the best deals from trusted retailers
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Purchase Link</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Store URL *</label>
                <Input
                  type="url"
                  placeholder="https://amazon.com/..."
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Retailer Name *</label>
                <Input
                  type="text"
                  placeholder="Amazon, Target, etc."
                  value={newLink.retailer}
                  onChange={(e) => setNewLink({ ...newLink, retailer: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Price (optional)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="24.99"
                    value={newLink.price}
                    onChange={(e) => setNewLink({ ...newLink, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Currency</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newLink.currency}
                    onChange={(e) => setNewLink({ ...newLink, currency: e.target.value })}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? 'Adding...' : 'Add Link'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase links yet</h3>
          <p className="text-gray-600 mb-4">
            Help the community by adding where this puzzle can be purchased
          </p>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Link
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <Card key={link.id} className="border border-gray-200 hover:border-emerald-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getRetailerIcon(link.retailer)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{link.retailer}</h3>
                        {link.verified && (
                          <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {link.price && (
                        <div className="flex items-center text-emerald-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {formatPrice(link.price, link.currency)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Buy Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Price comparison summary */}
          {links.some(link => link.price) && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700 font-medium">
                  💰 Best Price: {formatPrice(
                    Math.min(...links.filter(l => l.price).map(l => l.price!)), 
                    'USD'
                  )}
                </span>
                <span className="text-gray-600">
                  {links.filter(l => l.price).length} price{links.filter(l => l.price).length !== 1 ? 's' : ''} available
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 