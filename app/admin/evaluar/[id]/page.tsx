'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Request, EvaluationFactor, GroupLimit } from '@/lib/supabase'
import { ArrowLeft, ArrowRight, Save, FileText } from 'lucide-react'

export default function EvaluarPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string

  const [step, setStep] = useState(1)
  const [request, setRequest] = useState<Request | null>(null)
  const [factors, setFactors] = useState<EvaluationFactor[]>([])
  const [groupLimits, setGroupLimits] = useState<GroupLimit[]>([])
  
  const [formData, setFormData] = useState({
    eval_company_name: '',
    eval_position_name: '',
    eval_affected_people: '',
    eval_collective_agreement: '',
    eval_num_groups: 6 as 6 | 7 | 8,
    eval_direct_indirect: 'directo' as 'directo' | 'indirecto',
    factor_scores: {} as Record<string, number>
  })

  const [totalScore, setTotalScore] = useState(0)
  const [finalGroup, setFinalGroup] = useState('')

  useEffect(() => {
    loadData()
  }, [requestId])

  useEffect(() => {
    calculateTotal()
  }, [formData.factor_scores, formData.eval_num_groups])

  const loadData = async () => {
    // Cargar solicitud
    const { data: reqData } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle()

    if (reqData) {
      setRequest(reqData)
      setFormData(prev => ({
        ...prev,
        eval_company_name: reqData.company_name,
        eval_position_name: reqData.position_name,
        eval_collective_agreement: reqData.collective_agreement
      }))
    }

    // Cargar factores
    const { data: factorsData } = await supabase
      .from('evaluation_factors')
      .select('*')
      .eq('is_active', true)
      .order('subfactor_name')

    if (factorsData) setFactors(factorsData)

    // Cargar equivalencias
    const { data: limitsData } = await supabase
      .from('group_limits')
      .select('*')
      .order('num_groups').order('group_number')

    if (limitsData) setGroupLimits(limitsData)
  }

  const calculateTotal = () => {
    const scores = Object.values(formData.factor_scores).map(Number)
    const total = scores.reduce((sum, score) => sum + score, 0)
    setTotalScore(total)

    // Calcular grupo final
    const limits = groupLimits.filter(l => l.num_groups === formData.eval_num_groups)
    const group = limits.find(l => {
      if (l.max_points === null) return total >= l.min_points
      return total >= l.min_points && total <= l.max_points
    })
    
    if (group) {
      setFinalGroup(`Grupo ${group.group_number}`)
    }
  }

  const getRelevantFactors = () => {
    if (step !== 2) return []
    
    return factors.filter(factor => {
      // Siempre incluir factores comunes
      if (!factor.is_direct_indirect_specific) return true
      
      // Filtrar por tipo directo/indirecto
      const isDirIndType = formData.eval_direct_indirect === 'indirecto' ? 
        factor.subfactor_name.includes('.a') : 
        factor.subfactor_name.includes('.b')
      
      return isDirIndType || !factor.subfactor_name.match(/\.[ab]$/)
    })
  }

  const handleFactorChange = (factorName: string, grade: number, points: number) => {
    setFormData(prev => ({
      ...prev,
      factor_scores: {
        ...prev.factor_scores,
        [factorName]: points
      }
    }))
  }

  const saveEvaluation = async () => {
    if (!request) {
      alert('Error: No se encontró la solicitud')
      return
    }

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        alert('Debe iniciar sesión')
        return
      }

      const evaluationData = {
        request_id: requestId,
        tecnico_id: userData.user.id,
        ...formData,
        total_score: totalScore,
        final_group: finalGroup
      }

      const { data: savedEvaluation, error } = await supabase
        .from('evaluations')
        .insert([evaluationData])
        .select()
        .maybeSingle()

      if (error) throw error

      // Preparar datos del informe
      const factorScores = Object.entries(formData.factor_scores).map(([factorName, points]) => ({
        factorName,
        level: 1, // Podrías almacenar esto también si lo necesitas
        points
      }))

      // Generar informe en Google Drive
      try {
        await supabase.functions.invoke('generate-report-google-drive', {
          body: {
            evaluationId: savedEvaluation?.id,
            requestId: requestId,
            companyName: request.company_name,
            positionName: formData.eval_position_name || request.position_name,
            affectedPeople: formData.eval_affected_people,
            collectiveAgreement: formData.eval_collective_agreement || request.collective_agreement,
            factorScores: factorScores,
            totalScore: totalScore,
            finalGroup: finalGroup,
            evaluatedBy: userData.user.email,
            evaluationDate: new Date().toLocaleDateString('es-ES')
          }
        })
      } catch (reportError) {
        console.error('Error generando informe:', reportError)
        // No bloqueamos el flujo si falla la generación del informe
      }

      alert('Valoración guardada e informe generado exitosamente')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar la valoración')
    }
  }

  if (!request) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ugt-red text-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Asistente de Valoración - Manual TLC</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-ugt-red font-bold' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-ugt-red text-white' : 'bg-gray-300'}`}>1</div>
            <span className="ml-2">Datos Iniciales</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-ugt-red font-bold' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-ugt-red text-white' : 'bg-gray-300'}`}>2</div>
            <span className="ml-2">Valoración Factores</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-ugt-red font-bold' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-ugt-red text-white' : 'bg-gray-300'}`}>3</div>
            <span className="ml-2">Resultado Final</span>
          </div>
        </div>

        {/* Step 1: Datos Iniciales */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto card">
            <h2 className="text-2xl font-bold mb-6">Paso 1: Datos Iniciales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Empresa</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.eval_company_name}
                  onChange={(e) => setFormData({...formData, eval_company_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Puesto a Valorar</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.eval_position_name}
                  onChange={(e) => setFormData({...formData, eval_position_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Personas Afectadas</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.eval_affected_people}
                  onChange={(e) => setFormData({...formData, eval_affected_people: e.target.value})}
                  placeholder="Ejemplo: 5 trabajadores"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Convenio Colectivo</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.eval_collective_agreement}
                  onChange={(e) => setFormData({...formData, eval_collective_agreement: e.target.value})}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Tipo de Puesto</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="directo"
                      checked={formData.eval_direct_indirect === 'directo'}
                      onChange={(e) => setFormData({...formData, eval_direct_indirect: e.target.value as 'directo' | 'indirecto'})}
                      className="mr-2"
                    />
                    Directo (Producción)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="indirecto"
                      checked={formData.eval_direct_indirect === 'indirecto'}
                      onChange={(e) => setFormData({...formData, eval_direct_indirect: e.target.value as 'directo' | 'indirecto'})}
                      className="mr-2"
                    />
                    Indirecto (Administración/Técnicos)
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Número de Grupos del Convenio</label>
                <select
                  className="input-field"
                  value={formData.eval_num_groups}
                  onChange={(e) => setFormData({...formData, eval_num_groups: Number(e.target.value) as 6 | 7 | 8})}
                >
                  <option value={6}>6 Grupos</option>
                  <option value={7}>7 Grupos</option>
                  <option value={8}>8 Grupos</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} className="btn-primary flex items-center">
                Continuar <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Valoración de Factores */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto card">
            <h2 className="text-2xl font-bold mb-6">Paso 2: Valoración de Factores</h2>
            <p className="text-gray-600 mb-6">Seleccione el grado correspondiente para cada subfactor según el Manual TLC</p>

            <div className="space-y-8">
              {getRelevantFactors().map(factor => {
                const levels = Object.entries(factor.levels_data)
                return (
                  <div key={factor.factor_id} className="border-b pb-6">
                    <h3 className="font-bold text-lg mb-3 text-ugt-red">{factor.subfactor_name}</h3>
                    
                    <div className="space-y-2">
                      {levels.map(([grade, data]) => (
                        <label key={grade} className="flex items-start p-3 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name={factor.subfactor_name}
                            value={grade}
                            checked={formData.factor_scores[factor.subfactor_name] === data.points}
                            onChange={() => handleFactorChange(factor.subfactor_name, Number(grade), data.points)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold">Grado {grade}</span>
                              <span className="text-ugt-red font-bold">{data.points} puntos</span>
                            </div>
                            <p className="text-sm text-gray-600">{data.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="btn-secondary flex items-center">
                <ArrowLeft className="mr-2" size={20} /> Atrás
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex items-center">
                Ver Resultado <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Resultado Final */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto card">
            <h2 className="text-2xl font-bold mb-6 text-center">Resultado de la Valoración</h2>

            <div className="bg-ugt-red text-white p-8 rounded-lg text-center mb-8">
              <p className="text-lg mb-2">Puntuación Total</p>
              <p className="text-6xl font-bold">{totalScore}</p>
              <p className="text-2xl mt-4">puntos</p>
            </div>

            <div className="bg-green-100 border-2 border-green-500 p-6 rounded-lg text-center mb-8">
              <p className="text-lg text-gray-700 mb-2">Clasificación Final</p>
              <p className="text-4xl font-bold text-green-700">{finalGroup}</p>
            </div>

            <div className="border-t pt-6 mb-6">
              <h3 className="font-bold mb-4">Detalle de Puntuaciones</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.factor_scores).map(([factor, points]) => (
                  <div key={factor} className="flex justify-between border-b pb-2">
                    <span className="text-sm">{factor}:</span>
                    <span className="font-semibold">{points} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary flex items-center">
                <ArrowLeft className="mr-2" size={20} /> Modificar
              </button>
              <button onClick={saveEvaluation} className="btn-primary flex items-center">
                <Save className="mr-2" size={20} /> Guardar y Generar Informe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
