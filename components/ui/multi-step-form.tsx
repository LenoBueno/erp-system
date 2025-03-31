"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiStepFormProps } from "@/lib/types"

export function MultiStepForm({
  steps,
  initialValues,
  onSubmit,
  onCancel,
  submitButtonLabel = "Salvar",
  cancelButtonLabel = "Cancelar",
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formValues, setFormValues] = React.useState(initialValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [stepValid, setStepValid] = React.useState(false)

  // Referência para funções de validação expostas pelos componentes de etapa
  const stepValidateRef = React.useRef<() => Promise<boolean>>(async () => true)

  const handleNext = async () => {
    // Validar o passo atual usando o schema se disponível
    if (stepValidateRef.current) {
      const isValid = await stepValidateRef.current()
      if (!isValid) return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev: number) => prev + 1)
      setStepValid(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev: number) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Validar o último passo
    if (stepValidateRef.current) {
      const isValid = await stepValidateRef.current()
      if (!isValid) return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formValues)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para atualizar valores do formulário (passada para cada componente de etapa)
  const updateFormValues = (newValues: Partial<typeof formValues>) => {
    setFormValues((prev: typeof formValues) => ({ ...prev, ...newValues }))
  }

  // Função para registrar método de validação do passo atual
  const registerStepValidation = (validateFn: () => Promise<boolean>) => {
    stepValidateRef.current = validateFn
  }

  // Função para definir se o passo atual é válido
  const setCurrentStepValid = (valid: boolean) => {
    setStepValid(valid)
  }

  // Componente atual
  const CurrentStepComponent = steps[currentStep].component

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <div className="flex items-center mt-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`h-0.5 w-10 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <CurrentStepComponent 
          values={formValues}
          updateValues={updateFormValues}
          registerValidation={registerStepValidation}
          setStepValid={setCurrentStepValid}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelButtonLabel}
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={isSubmitting || !stepValid}
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !stepValid}
            >
              {isSubmitting ? "Salvando..." : submitButtonLabel}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
