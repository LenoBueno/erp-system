"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { maskPhone, validateEmail } from "@/lib/utils"
import { Search } from "lucide-react"

interface Address {
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface ContatosEnderecosProps {
  data: {
    email: string
    phone: string
    contact_name: string
    billing_address: Address
    shipping_address: {
      same_as_billing: boolean
    } & Address
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function ContatosEnderecos({ data, onChange, errors }: ContatosEnderecosProps) {
  const [phoneValue, setPhoneValue] = useState(data.phone)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  
  useEffect(() => {
    setPhoneValue(maskPhone(data.phone))
  }, [data.phone])
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhoneValue(maskPhone(value))
    onChange("phone", value)
  }
  
  const handleAddressChange = (type: "billing" | "shipping", field: string, value: string) => {
    const addressType = type === "billing" ? "billing_address" : "shipping_address"
    onChange(addressType, { ...data[addressType], [field]: value })
  }
  
  const handleSameAsBillingChange = (checked: boolean) => {
    let newShippingAddress = { ...data.shipping_address, same_as_billing: checked }
    
    if (checked) {
      // Copiar endereço de faturamento para entrega
      newShippingAddress = {
        ...newShippingAddress,
        street: data.billing_address.street,
        number: data.billing_address.number,
        complement: data.billing_address.complement,
        neighborhood: data.billing_address.neighborhood,
        city: data.billing_address.city,
        state: data.billing_address.state,
        postal_code: data.billing_address.postal_code,
        country: data.billing_address.country
      }
    }
    
    onChange("shipping_address", newShippingAddress)
  }
  
  const searchCep = async (type: "billing" | "shipping") => {
    const addressType = type === "billing" ? "billing_address" : "shipping_address"
    const cep = data[addressType].postal_code.replace(/\D/g, "")
    
    if (cep.length !== 8) {
      return
    }
    
    setIsLoadingCep(true)
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const cepData = await response.json()
      
      if (!cepData.erro) {
        const newAddress = {
          ...data[addressType],
          street: cepData.logradouro,
          neighborhood: cepData.bairro,
          city: cepData.localidade,
          state: cepData.uf,
          country: "Brasil"
        }
        
        onChange(addressType, newAddress)
        
        // Se o endereço de entrega for o mesmo que o de faturamento, atualizar também
        if (type === "billing" && data.shipping_address.same_as_billing) {
          onChange("shipping_address", {
            ...data.shipping_address,
            ...newAddress
          })
        }
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    } finally {
      setIsLoadingCep(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="required">E-mail</Label>
              <Input 
                id="email" 
                type="email"
                value={data.email} 
                onChange={(e) => onChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="required">Telefone</Label>
              <Input 
                id="phone" 
                value={phoneValue} 
                onChange={handlePhoneChange}
                className={errors.phone ? "border-red-500" : ""}
                required
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contact_name">Nome do Responsável pelo Contato</Label>
              <Input 
                id="contact_name" 
                value={data.contact_name} 
                onChange={(e) => onChange("contact_name", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="billing_postal_code" className="required">CEP</Label>
              <div className="flex gap-2">
                <Input 
                  id="billing_postal_code" 
                  value={data.billing_address.postal_code} 
                  onChange={(e) => handleAddressChange("billing", "postal_code", e.target.value)}
                  className={errors["billing_address.postal_code"] ? "border-red-500" : ""}
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => searchCep("billing")}
                  disabled={isLoadingCep}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors["billing_address.postal_code"] && (
                <p className="text-xs text-red-500">{errors["billing_address.postal_code"]}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="billing_street" className="required">Rua</Label>
              <Input 
                id="billing_street" 
                value={data.billing_address.street} 
                onChange={(e) => handleAddressChange("billing", "street", e.target.value)}
                className={errors["billing_address.street"] ? "border-red-500" : ""}
                required
              />
              {errors["billing_address.street"] && (
                <p className="text-xs text-red-500">{errors["billing_address.street"]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_number" className="required">Número</Label>
              <Input 
                id="billing_number" 
                value={data.billing_address.number} 
                onChange={(e) => handleAddressChange("billing", "number", e.target.value)}
                className={errors["billing_address.number"] ? "border-red-500" : ""}
                required
              />
              {errors["billing_address.number"] && (
                <p className="text-xs text-red-500">{errors["billing_address.number"]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_complement">Complemento</Label>
              <Input 
                id="billing_complement" 
                value={data.billing_address.complement} 
                onChange={(e) => handleAddressChange("billing", "complement", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_neighborhood" className="required">Bairro</Label>
              <Input 
                id="billing_neighborhood" 
                value={data.billing_address.neighborhood} 
                onChange={(e) => handleAddressChange("billing", "neighborhood", e.target.value)}
                className={errors["billing_address.neighborhood"] ? "border-red-500" : ""}
                required
              />
              {errors["billing_address.neighborhood"] && (
                <p className="text-xs text-red-500">{errors["billing_address.neighborhood"]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_city" className="required">Cidade</Label>
              <Input 
                id="billing_city" 
                value={data.billing_address.city} 
                onChange={(e) => handleAddressChange("billing", "city", e.target.value)}
                className={errors["billing_address.city"] ? "border-red-500" : ""}
                required
              />
              {errors["billing_address.city"] && (
                <p className="text-xs text-red-500">{errors["billing_address.city"]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_state" className="required">Estado</Label>
              <Input 
                id="billing_state" 
                value={data.billing_address.state} 
                onChange={(e) => handleAddressChange("billing", "state", e.target.value)}
                className={errors["billing_address.state"] ? "border-red-500" : ""}
                required
              />
              {errors["billing_address.state"] && (
                <p className="text-xs text-red-500">{errors["billing_address.state"]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_country" className="required">País</Label>
              <Input 
                id="billing_country" 
                value={data.billing_address.country} 
                onChange={(e) => handleAddressChange("billing", "country", e.target.value)}
                className={errors["billing_address.country"] ? "border-red-500" : ""}
                required
              />
              {errors["billing_address.country"] && (
                <p className="text-xs text-red-500">{errors["billing_address.country"]}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="same_as_billing" 
                checked={data.shipping_address.same_as_billing}
                onCheckedChange={handleSameAsBillingChange}
              />
              <Label htmlFor="same_as_billing">
                Mesmo endereço de faturamento
              </Label>
            </div>
          </div>
          
          {!data.shipping_address.same_as_billing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shipping_postal_code" className="required">CEP</Label>
                <div className="flex gap-2">
                  <Input 
                    id="shipping_postal_code" 
                    value={data.shipping_address.postal_code} 
                    onChange={(e) => handleAddressChange("shipping", "postal_code", e.target.value)}
                    className={errors["shipping_address.postal_code"] ? "border-red-500" : ""}
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => searchCep("shipping")}
                    disabled={isLoadingCep}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {errors["shipping_address.postal_code"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.postal_code"]}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shipping_street" className="required">Rua</Label>
                <Input 
                  id="shipping_street" 
                  value={data.shipping_address.street} 
                  onChange={(e) => handleAddressChange("shipping", "street", e.target.value)}
                  className={errors["shipping_address.street"] ? "border-red-500" : ""}
                  required
                />
                {errors["shipping_address.street"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.street"]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping_number" className="required">Número</Label>
                <Input 
                  id="shipping_number" 
                  value={data.shipping_address.number} 
                  onChange={(e) => handleAddressChange("shipping", "number", e.target.value)}
                  className={errors["shipping_address.number"] ? "border-red-500" : ""}
                  required
                />
                {errors["shipping_address.number"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.number"]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping_complement">Complemento</Label>
                <Input 
                  id="shipping_complement" 
                  value={data.shipping_address.complement} 
                  onChange={(e) => handleAddressChange("shipping", "complement", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping_neighborhood" className="required">Bairro</Label>
                <Input 
                  id="shipping_neighborhood" 
                  value={data.shipping_address.neighborhood} 
                  onChange={(e) => handleAddressChange("shipping", "neighborhood", e.target.value)}
                  className={errors["shipping_address.neighborhood"] ? "border-red-500" : ""}
                  required
                />
                {errors["shipping_address.neighborhood"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.neighborhood"]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping_city" className="required">Cidade</Label>
                <Input 
                  id="shipping_city" 
                  value={data.shipping_address.city} 
                  onChange={(e) => handleAddressChange("shipping", "city", e.target.value)}
                  className={errors["shipping_address.city"] ? "border-red-500" : ""}
                  required
                />
                {errors["shipping_address.city"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.city"]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping_state" className="required">Estado</Label>
                <Input 
                  id="shipping_state" 
                  value={data.shipping_address.state} 
                  onChange={(e) => handleAddressChange("shipping", "state", e.target.value)}
                  className={errors["shipping_address.state"] ? "border-red-500" : ""}
                  required
                />
                {errors["shipping_address.state"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.state"]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipping_country" className="required">País</Label>
                <Input 
                  id="shipping_country" 
                  value={data.shipping_address.country} 
                  onChange={(e) => handleAddressChange("shipping", "country", e.target.value)}
                  className={errors["shipping_address.country"] ? "border-red-500" : ""}
                  required
                />
                {errors["shipping_address.country"] && (
                  <p className="text-xs text-red-500">{errors["shipping_address.country"]}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
