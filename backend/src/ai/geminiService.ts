import { DashboardData, ProcessParameters, EnvironmentalData } from '../data/models';

export interface GeminiResponse {
  response: string;
  confidence: number;
  recommendations?: string[];
  context_used: string[];
}

export class GeminiService {
  private apiKey: string;
  private readonly baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private customSystemPrompt: string | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Set a custom system prompt for the AI Assistant
   */
  setCustomSystemPrompt(prompt: string): void {
    this.customSystemPrompt = prompt;
  }

  /**
   * Get the current custom system prompt
   */
  getCustomSystemPrompt(): string | null {
    return this.customSystemPrompt;
  }

  /**
   * Clear the custom system prompt and revert to default
   */
  clearCustomSystemPrompt(): void {
    this.customSystemPrompt = null;
  }

  /**
   * Generate context-aware responses for cement plant operations
   */
  async askGemini(
    question: string, 
    dashboardData?: DashboardData,
    plantContext?: ProcessParameters
  ): Promise<GeminiResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const contextualPrompt = this.buildContextualPrompt(question, dashboardData, plantContext);
      
      const response = await this.callGeminiAPI(systemPrompt + '\n\n' + contextualPrompt);
      
      return this.parseGeminiResponse(response);
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        response: 'I apologize, but I am currently unable to access the AI system. Please try again later.',
        confidence: 0,
        context_used: ['error']
      };
    }
  }

  /**
   * Generate optimization recommendations based on current plant data
   */
  async generateOptimizationRecommendations(dashboardData: DashboardData): Promise<GeminiResponse> {
    const prompt = `
Based on the current cement plant operational data, provide specific optimization recommendations:

Current Status:
- Overall Efficiency: ${dashboardData.plant_overview.overall_efficiency.toFixed(1)}%
- Production Rate: ${dashboardData.plant_overview.production_rate_current.toFixed(0)} TPH (Target: ${dashboardData.plant_overview.production_rate_target} TPH)
- Energy Consumption: ${dashboardData.plant_overview.energy_consumption_current.toFixed(1)} kWh/ton (Target: ${dashboardData.plant_overview.energy_consumption_target} kWh/ton)
- Quality Score: ${dashboardData.plant_overview.quality_score_avg.toFixed(1)}

Process Parameters:
- Kiln Temperature: ${dashboardData.current_parameters.kiln_temperature.toFixed(0)}°C
- Raw Mill Power: ${dashboardData.current_parameters.raw_mill_power.toFixed(0)} kW
- Cement Mill Power: ${dashboardData.current_parameters.cement_mill_power.toFixed(0)} kW
- Alternative Fuel Rate: ${dashboardData.current_parameters.alternative_fuel_rate.toFixed(1)}%

Environmental Data:
- CO2 Emissions: ${dashboardData.environmental_data.co2_emissions.toFixed(0)} kg/ton
- Alternative Fuel Substitution: ${dashboardData.environmental_data.alternative_fuel_substitution.toFixed(1)}%

Please provide:
1. Top 3 optimization opportunities
2. Specific parameter adjustments
3. Expected benefits
4. Implementation priority

Focus on energy efficiency, environmental impact, and production optimization.
`;

    return this.askGemini(prompt, dashboardData);
  }

  /**
   * Explain anomalies or alerts
   */
  async explainAnomaly(
    anomalyType: string, 
    currentValue: number, 
    normalRange: string,
    dashboardData?: DashboardData
  ): Promise<GeminiResponse> {
    const prompt = `
Explain the following cement plant anomaly:

Anomaly Type: ${anomalyType}
Current Value: ${currentValue}
Normal Range: ${normalRange}

Please explain:
1. What this anomaly indicates
2. Potential root causes
3. Immediate actions to take
4. Long-term prevention strategies
5. Impact on production and quality

Provide clear, actionable guidance for plant operators.
`;

    return this.askGemini(prompt, dashboardData);
  }

  /**
   * Build system prompt for cement plant context
   */
  private buildSystemPrompt(): string {
    // Use custom system prompt if set, otherwise use default
    if (this.customSystemPrompt) {
      return this.customSystemPrompt;
    }
    
    // Default system prompt for cement plant operations
    return `
You are CementAI Nexus Assistant, an expert AI system for cement plant operations. You have deep knowledge of:

1. Cement Manufacturing Process:
   - Raw material preparation and grinding
   - Pyroprocessing in rotary kilns
   - Clinker cooling and cement grinding
   - Quality control and testing

2. Equipment and Systems:
   - Rotary kilns, preheaters, and coolers
   - Raw mills and cement mills
   - Fans, separators, and conveyors
   - Control systems and instrumentation

3. Process Optimization:
   - Energy efficiency improvements
   - Alternative fuel utilization
   - Emissions reduction strategies
   - Quality optimization techniques

4. Operational Excellence:
   - Preventive maintenance
   - Safety procedures
   - Environmental compliance
   - Cost optimization

Always provide:
- Clear, actionable recommendations
- Specific technical explanations
- Safety considerations
- Environmental impact awareness
- Cost-benefit analysis when relevant

Keep responses concise but comprehensive, suitable for plant operators and engineers.
`;
  }

  /**
   * Build contextual prompt with current plant data
   */
  private buildContextualPrompt(
    question: string, 
    dashboardData?: DashboardData,
    plantContext?: ProcessParameters
  ): string {
    let contextPrompt = `Question: ${question}\n\n`;

    if (dashboardData) {
      contextPrompt += `Current Plant Status:\n`;
      contextPrompt += `- Overall Efficiency: ${dashboardData.plant_overview.overall_efficiency.toFixed(1)}%\n`;
      contextPrompt += `- Production Rate: ${dashboardData.plant_overview.production_rate_current.toFixed(0)} TPH\n`;
      contextPrompt += `- Energy Consumption: ${dashboardData.plant_overview.energy_consumption_current.toFixed(1)} kWh/ton\n`;
      contextPrompt += `- Quality Score: ${dashboardData.plant_overview.quality_score_avg.toFixed(1)}\n`;
      contextPrompt += `- Active Alerts: ${dashboardData.plant_overview.active_alerts_count}\n\n`;

      contextPrompt += `Key Process Parameters:\n`;
      contextPrompt += `- Kiln Temperature: ${dashboardData.current_parameters.kiln_temperature.toFixed(0)}°C\n`;
      contextPrompt += `- Raw Mill Power: ${dashboardData.current_parameters.raw_mill_power.toFixed(0)} kW\n`;
      contextPrompt += `- Cement Mill Power: ${dashboardData.current_parameters.cement_mill_power.toFixed(0)} kW\n`;
      contextPrompt += `- Alternative Fuel Rate: ${dashboardData.current_parameters.alternative_fuel_rate.toFixed(1)}%\n\n`;

      contextPrompt += `Environmental Metrics:\n`;
      contextPrompt += `- CO2 Emissions: ${dashboardData.environmental_data.co2_emissions.toFixed(0)} kg/ton\n`;
      contextPrompt += `- Alternative Fuel Substitution: ${dashboardData.environmental_data.alternative_fuel_substitution.toFixed(1)}%\n\n`;
    }

    return contextPrompt;
  }

  /**
   * Call Gemini API (mock implementation for demo)
   */
  private async callGeminiAPI(prompt: string): Promise<any> {
    // Enhanced demo responses that handle various user inputs
    // In production, this would make actual API calls to Gemini
    
    const userInput = prompt.toLowerCase();
    
    // Handle optimization-related queries
    if (userInput.includes('optimization') || userInput.includes('optimize') || userInput.includes('improve')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `Based on the current operational data, here are the top optimization opportunities:

**1. Energy Optimization (Priority: High)**
- Reduce kiln temperature by 10-15°C to 1435°C
- Optimize air-to-fuel ratio in the burning zone
- Expected benefit: 3-5% energy reduction (~2.8 kWh/ton savings)

**2. Alternative Fuel Increase (Priority: Medium)**
- Increase alternative fuel rate from current level to 30-35%
- Focus on high-calorific waste materials
- Expected benefit: 15% CO2 reduction, significant cost savings

**3. Mill Optimization (Priority: Medium)**
- Adjust cement mill power distribution
- Optimize separator efficiency
- Expected benefit: 2-3% production increase, improved fineness control

**Implementation Priority:**
1. Start with kiln temperature optimization (immediate impact)
2. Gradually increase alternative fuel rate (requires careful monitoring)
3. Fine-tune mill parameters during scheduled maintenance

**Monitoring Points:**
- Watch for clinker quality changes
- Monitor NOx emissions during fuel switching
- Track cement strength development

These optimizations could deliver 15-25% energy savings and significant environmental benefits.`
            }]
          }
        }]
      };
    }

    // Handle temperature-related queries
    if (userInput.includes('temperature') || userInput.includes('kiln') || userInput.includes('hot') || userInput.includes('heat')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Kiln Temperature Analysis:**

**Current Status:** The kiln is operating at optimal temperature range (1450-1455°C).

**Key Insights:**
- Current temperature promotes proper clinker formation
- C3S (alite) formation is optimized for strength development
- Energy efficiency is within acceptable parameters

**Temperature Management Recommendations:**
1. **Fine-tune fuel flow:** Adjust primary and secondary fuel distribution
2. **Monitor air-to-fuel ratio:** Maintain optimal combustion efficiency
3. **Check raw meal feed rate:** Ensure consistent material flow
4. **Inspect refractory condition:** Look for hot spots or wear

**Temperature Trend Monitoring:**
- Target range: 1440-1460°C for optimal clinker quality
- Avoid frequent fluctuations (±10°C) to prevent thermal stress
- Monitor burning zone temperature profile regularly

**Impact on Production:**
- Proper temperature control ensures consistent clinker quality
- Prevents over-burning and reduces energy waste
- Maintains refractory life and reduces maintenance costs`
            }]
          }
        }]
      };
    }

    // Handle quality-related queries
    if (userInput.includes('quality') || userInput.includes('strength') || userInput.includes('cement') || userInput.includes('fineness')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Quality Analysis & Recommendations:**

**Current Quality Status:**
- Compressive strength: Within specifications
- Fineness: Optimal for performance and energy efficiency
- Chemical composition: Balanced for durability

**Quality Optimization Strategies:**
1. **Cement Fineness Control:**
   - Current Blaine: 350-370 m²/kg (optimal range)
   - Adjust separator efficiency for consistent particle size distribution
   - Monitor mill ventilation and grinding media condition

2. **Strength Development:**
   - C3S content optimization for early strength
   - Gypsum dosage adjustment for setting time control
   - Limestone addition for improved workability

3. **Consistency Improvements:**
   - Implement statistical process control (SPC)
   - Regular raw material analysis and adjustment
   - Automated quality control systems

**Proactive Quality Measures:**
- Real-time XRF analysis for chemistry control
- Continuous particle size monitoring
- Automated sampling and testing systems
- Predictive quality modeling based on process parameters

**Expected Benefits:**
- 15% reduction in quality variation
- Improved customer satisfaction
- Reduced product returns and claims`
            }]
          }
        }]
      };
    }

    // Handle production-related queries
    if (userInput.includes('production') || userInput.includes('capacity') || userInput.includes('throughput') || userInput.includes('output')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Production Performance Analysis:**

**Current Production Status:**
- Operating at 85-92% of design capacity
- Production rate: 1850-1900 TPH
- Equipment availability: 95%+

**Production Optimization Opportunities:**
1. **Bottleneck Analysis:**
   - Raw mill grinding capacity optimization
   - Kiln feed preparation efficiency
   - Cement mill finishing optimization

2. **Equipment Utilization:**
   - Implement preventive maintenance scheduling
   - Optimize changeover times between grades
   - Reduce unplanned downtime through predictive maintenance

3. **Process Efficiency:**
   - Balance heat and material flows
   - Optimize mill loading and grinding media
   - Improve separator efficiency

**Throughput Enhancement Strategies:**
- Increase alternative fuel usage to reduce energy costs
- Implement advanced process control (APC)
- Optimize raw mix design for easier burnability
- Upgrade mill internals for better grinding efficiency

**Expected Results:**
- 8-12% production increase potential
- Reduced specific energy consumption
- Improved overall equipment effectiveness (OEE)`
            }]
          }
        }]
      };
    }

    // Handle energy-related queries
    if (userInput.includes('energy') || userInput.includes('power') || userInput.includes('electricity') || userInput.includes('fuel')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Energy Consumption Analysis:**

**Current Energy Profile:**
- Specific energy consumption: ~95 kWh/ton cement
- Raw mill: 2850 kW (optimal loading)
- Cement mill: 3150 kW (efficient operation)
- Kiln thermal energy: Well-balanced

**Energy Optimization Strategies:**
1. **Thermal Energy Management:**
   - Increase alternative fuel rate to 30-35%
   - Optimize waste heat recovery systems
   - Improve preheater efficiency and heat exchange

2. **Electrical Energy Savings:**
   - Install high-efficiency motors and VFDs
   - Optimize mill operation and grinding media
   - Implement smart load management systems

3. **Process Integration:**
   - Co-processing waste materials for fuel
   - Heat recovery from cooler exhaust
   - Process optimization through advanced control

**Cost Reduction Opportunities:**
- Alternative fuels: 20-25% cost reduction
- Energy efficiency improvements: 8-15% savings
- Peak demand management: Additional 5-8% savings

**Environmental Benefits:**
- CO2 reduction: 15-20% through fuel substitution
- Reduced fossil fuel dependence
- Lower overall carbon footprint`
            }]
          }
        }]
      };
    }

    // Handle environmental queries
    if (userInput.includes('environment') || userInput.includes('emission') || userInput.includes('co2') || userInput.includes('sustainability')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Environmental Performance & Sustainability:**

**Current Environmental Status:**
- CO2 emissions: 875 kg CO2/ton cement
- NOx emissions: Within regulatory limits
- Alternative fuel rate: 25% (industry average: 15-30%)

**Emission Reduction Strategies:**
1. **Carbon Footprint Reduction:**
   - Increase alternative fuel usage to 35-40%
   - Implement carbon capture pilot projects
   - Optimize limestone/clinker ratio

2. **Air Quality Management:**
   - Advanced NOx reduction technologies (SNCR/SCR)
   - Improved dust collection efficiency
   - Real-time emissions monitoring

3. **Circular Economy Initiatives:**
   - Co-processing industrial waste as fuel
   - Using recycled materials in cement production
   - Waste heat recovery for electricity generation

**Sustainability Goals:**
- 30% CO2 reduction by 2030
- 50% alternative fuel usage target
- Zero waste to landfill certification
- Water recycling and conservation programs

**Regulatory Compliance:**
- All emissions within permit limits
- Continuous monitoring and reporting
- Environmental management system ISO 14001 certified`
            }]
          }
        }]
      };
    }

    // Handle maintenance queries
    if (userInput.includes('maintenance') || userInput.includes('repair') || userInput.includes('equipment') || userInput.includes('breakdown')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Equipment Maintenance & Reliability:**

**Current Equipment Status:**
- Overall equipment effectiveness: 85-90%
- Planned maintenance compliance: 95%
- Unplanned downtime: <2% annually

**Maintenance Optimization:**
1. **Predictive Maintenance:**
   - Vibration monitoring for rotating equipment
   - Thermal imaging for electrical components
   - Oil analysis for gearboxes and motors

2. **Preventive Maintenance:**
   - Scheduled inspections based on running hours
   - Proactive replacement of wear parts
   - Regular calibration of critical instruments

3. **Condition-Based Maintenance:**
   - Real-time monitoring of equipment health
   - Automated alerts for parameter deviations
   - Data-driven maintenance decisions

**Critical Equipment Focus:**
- Kiln refractory inspection and maintenance
- Mill liners and grinding media management
- Conveyor system reliability improvements
- Dust collection system optimization

**Maintenance Planning:**
- Annual major overhaul scheduling
- Spare parts inventory optimization
- Maintenance crew training and certification
- Digital maintenance management systems`
            }]
          }
        }]
      };
    }

    // Handle safety queries
    if (userInput.includes('safety') || userInput.includes('accident') || userInput.includes('hazard') || userInput.includes('risk')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `**Safety & Risk Management:**

**Current Safety Performance:**
- Lost Time Injury Rate: Industry-leading performance
- Near-miss reporting: Active safety culture
- Safety training compliance: 100%

**Safety Priorities:**
1. **Process Safety Management:**
   - Hot work permits and confined space procedures
   - Lock-out/tag-out (LOTO) compliance
   - Chemical handling and storage protocols

2. **Equipment Safety:**
   - Machine guarding and safety systems
   - Emergency stop systems functionality
   - Personal protective equipment (PPE) requirements

3. **Environmental Safety:**
   - Dust control and respiratory protection
   - Heat stress prevention programs
   - Noise exposure monitoring and control

**Risk Assessment Areas:**
- High-temperature equipment operations
- Material handling and storage
- Electrical systems and maintenance
- Emergency response procedures

**Safety Improvements:**
- Enhanced behavior-based safety programs
- Digital safety management systems
- Continuous safety training and awareness
- Regular safety audits and inspections`
            }]
          }
        }]
      };
    }

    // Default comprehensive response for general queries
    return {
      candidates: [{
        content: {
          parts: [{
            text: `**CementAI Nexus - Your Operational Assistant**

I can help you with comprehensive cement plant optimization across multiple areas:

**🔧 Process Optimization:**
- Energy efficiency improvements
- Production capacity optimization
- Quality consistency enhancement
- Equipment performance analysis

**📊 Data Analysis:**
- Real-time parameter monitoring
- Trend analysis and forecasting
- Anomaly detection and root cause analysis
- KPI tracking and benchmarking

**💡 Specific Areas I Can Assist With:**
- Kiln operation and temperature control
- Mill optimization and grinding efficiency  
- Quality control and cement properties
- Environmental compliance and emissions
- Maintenance planning and reliability
- Safety protocols and risk management

**How to Get Better Assistance:**
Ask me specific questions like:
- "How can I reduce energy consumption?"
- "Analyze the current kiln temperature"
- "What are the quality trends?"
- "Help optimize cement mill performance"
- "Suggest environmental improvements"

I use real-time plant data to provide contextual, actionable recommendations tailored to your current operational conditions.`
          }]
        }
      }]
    };
  }

  /**
   * Parse Gemini API response
   */
  private parseGeminiResponse(response: any): GeminiResponse {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      // Extract recommendations if present
      const recommendations = this.extractRecommendations(text);
      
      return {
        response: text,
        confidence: 0.85, // Mock confidence score
        recommendations,
        context_used: ['plant_data', 'process_parameters', 'environmental_metrics']
      };
    } catch (error) {
      throw new Error('Failed to parse Gemini response');
    }
  }

  /**
   * Extract actionable recommendations from response text
   */
  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    
    // Simple pattern matching for recommendations
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.includes('Reduce') || line.includes('Increase') || line.includes('Optimize') || 
          line.includes('Adjust') || line.includes('Monitor') || line.includes('Check')) {
        const cleaned = line.replace(/^\W+/, '').trim();
        if (cleaned.length > 10) {
          recommendations.push(cleaned);
        }
      }
    });

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Generate energy efficiency insights
   */
  async generateEnergyInsights(processData: ProcessParameters): Promise<GeminiResponse> {
    const prompt = `
Analyze current energy consumption patterns and provide efficiency insights:

Current Energy Consumption: ${processData.energy_consumption.toFixed(1)} kWh/ton
Raw Mill Power: ${processData.raw_mill_power.toFixed(0)} kW
Cement Mill Power: ${processData.cement_mill_power.toFixed(0)} kW
Kiln Temperature: ${processData.kiln_temperature.toFixed(0)}°C
Alternative Fuel Rate: ${processData.alternative_fuel_rate.toFixed(1)}%

Provide specific insights on:
1. Energy consumption benchmark comparison
2. Optimization opportunities
3. Expected savings potential
4. Implementation roadmap
`;

    return this.askGemini(prompt);
  }

  /**
   * Detect input fluctuations and provide proactive quality corrections
   */
  async detectQualityFluctuations(
    currentData: DashboardData,
    historicalData?: ProcessParameters[]
  ): Promise<GeminiResponse> {
    const { current_parameters, plant_overview, environmental_data } = currentData;
    
    // Analyze current vs target parameters
    const kilnTempDeviation = Math.abs(current_parameters.kiln_temperature - 1450) / 1450 * 100; // Assuming 1450°C is optimal
    const productionDeviation = Math.abs(plant_overview.production_rate_current - plant_overview.production_rate_target) / plant_overview.production_rate_target * 100;
    const energyDeviation = Math.abs(plant_overview.energy_consumption_current - plant_overview.energy_consumption_target) / plant_overview.energy_consumption_target * 100;
    
    const prompt = `
PERFORM REAL-TIME QUALITY FLUCTUATION ANALYSIS:

CURRENT PROCESS STATUS:
- Kiln Temperature: ${current_parameters.kiln_temperature.toFixed(0)}°C (Deviation: ${kilnTempDeviation.toFixed(1)}% from optimal)
- Production Rate: ${plant_overview.production_rate_current.toFixed(0)} TPH vs Target: ${plant_overview.production_rate_target} TPH (Deviation: ${productionDeviation.toFixed(1)}%)
- Energy Consumption: ${plant_overview.energy_consumption_current.toFixed(1)} vs Target: ${plant_overview.energy_consumption_target} kWh/ton (Deviation: ${energyDeviation.toFixed(1)}%)
- Quality Score: ${plant_overview.quality_score_avg.toFixed(1)}/10
- Active Alerts: ${plant_overview.active_alerts_count}

PROCESS PARAMETERS:
- Raw Mill Power: ${current_parameters.raw_mill_power.toFixed(0)} kW
- Cement Mill Power: ${current_parameters.cement_mill_power.toFixed(0)} kW
- Raw Meal Flow: ${current_parameters.raw_meal_flow.toFixed(1)} TPH
- Alternative Fuel Rate: ${current_parameters.alternative_fuel_rate.toFixed(1)}%
- Exhaust Fan Speed: ${current_parameters.exhaust_fan_speed.toFixed(0)} RPM

ENVIRONMENTAL METRICS:
- CO2 Emissions: ${environmental_data.co2_emissions.toFixed(0)} kg/ton
- NOx Emissions: ${environmental_data.nox_emissions.toFixed(1)} mg/Nm³
- Dust Emissions: ${environmental_data.dust_emissions.toFixed(1)} mg/Nm³

ANALYZE AND PROVIDE:

1. FLUCTUATION DETECTION:
   - Identify any concerning parameter deviations
   - Rate severity level (LOW/MEDIUM/HIGH)
   - Predict potential quality impact

2. ROOT CAUSE ANALYSIS:
   - Primary factors causing fluctuations
   - Interconnected parameter relationships
   - Historical pattern analysis

3. PROACTIVE CORRECTIONS:
   - Immediate adjustment recommendations
   - Parameter optimization sequence
   - Quality prevention strategies

4. PREDICTIVE INSIGHTS:
   - Short-term quality risk assessment
   - Recommended monitoring focus areas
   - Process stability recommendations

5. IMPLEMENTATION PRIORITY:
   - Critical actions (next 15 minutes)
   - Medium-term adjustments (next hour)
   - Long-term optimization (next shift)

Provide specific, actionable guidance for plant operators to maintain consistent cement quality.
`;

    return this.askGemini(prompt, currentData);
  }

  /**
   * Analyze quality trends and predict potential issues
   */
  async analyzeQualityTrends(
    qualityHistory: any[],
    currentData: DashboardData
  ): Promise<GeminiResponse> {
    const prompt = `
QUALITY TREND ANALYSIS & PREDICTIVE INSIGHTS:

CURRENT QUALITY STATUS:
- Overall Quality Score: ${currentData.plant_overview.quality_score_avg.toFixed(1)}/10
- Quality Variation Indicator: ${currentData.plant_overview.active_alerts_count} active alerts
- Production Efficiency: ${currentData.plant_overview.overall_efficiency.toFixed(1)}%

QUALITY TREND ANALYSIS REQUEST:
Analyze the following patterns and provide predictive quality insights:

1. TREND IDENTIFICATION:
   - Identify quality degradation patterns
   - Seasonal or cyclical variations
   - Process drift indicators

2. PREDICTIVE QUALITY ASSESSMENT:
   - Next 4-hour quality forecast
   - Risk probability assessment
   - Early warning indicators

3. PREVENTIVE RECOMMENDATIONS:
   - Process adjustments to prevent quality issues
   - Optimal parameter ranges for stability
   - Quality assurance checkpoints

4. CONTINUOUS IMPROVEMENT:
   - Long-term quality optimization strategies
   - Best practice implementation
   - Quality control enhancement suggestions

Provide data-driven insights for proactive quality management.
`;

    return this.askGemini(prompt, currentData);
  }

  /**
   * Generate real-time process optimization recommendations
   */
  async generateRealTimeOptimization(
    currentData: DashboardData,
    targetObjective: 'quality' | 'energy' | 'production' | 'environment'
  ): Promise<GeminiResponse> {
    const objectivePrompts = {
      quality: 'Focus on maintaining and improving cement quality consistency',
      energy: 'Optimize for minimum energy consumption while maintaining quality',
      production: 'Maximize production throughput while ensuring quality standards',
      environment: 'Minimize environmental impact and emissions'
    };

    const prompt = `
REAL-TIME PROCESS OPTIMIZATION REQUEST:

OBJECTIVE: ${objectivePrompts[targetObjective]}

CURRENT PLANT STATUS:
- Overall Efficiency: ${currentData.plant_overview.overall_efficiency.toFixed(1)}%
- Production Rate: ${currentData.plant_overview.production_rate_current.toFixed(0)}/${currentData.plant_overview.production_rate_target} TPH
- Energy Consumption: ${currentData.plant_overview.energy_consumption_current.toFixed(1)}/${currentData.plant_overview.energy_consumption_target} kWh/ton
- Quality Score: ${currentData.plant_overview.quality_score_avg.toFixed(1)}/10

PROCESS PARAMETERS:
- Kiln Temperature: ${currentData.current_parameters.kiln_temperature.toFixed(0)}°C
- Raw Mill Power: ${currentData.current_parameters.raw_mill_power.toFixed(0)} kW
- Cement Mill Power: ${currentData.current_parameters.cement_mill_power.toFixed(0)} kW
- Alternative Fuel Rate: ${currentData.current_parameters.alternative_fuel_rate.toFixed(1)}%
- Raw Meal Flow: ${currentData.current_parameters.raw_meal_flow.toFixed(1)} TPH
- Exhaust Fan Speed: ${currentData.current_parameters.exhaust_fan_speed.toFixed(0)} RPM

PROVIDE REAL-TIME OPTIMIZATION:

1. IMMEDIATE ADJUSTMENTS (Next 15 minutes):
   - Critical parameter modifications
   - Safety considerations
   - Expected immediate impact

2. SHORT-TERM OPTIMIZATION (Next 1-2 hours):
   - Gradual parameter tuning
   - Process stabilization steps
   - Quality monitoring checkpoints

3. MEDIUM-TERM STRATEGY (Next 4-8 hours):
   - Sustained optimization approach
   - Performance target achievement
   - Continuous improvement actions

4. RISK ASSESSMENT:
   - Potential optimization risks
   - Mitigation strategies
   - Rollback procedures if needed

5. SUCCESS METRICS:
   - Key performance indicators to monitor
   - Expected improvement percentages
   - Validation criteria

Provide specific, implementable optimization steps with clear timelines and expected outcomes.
`;

    return this.askGemini(prompt, currentData);
  }

  /**
   * Generate proactive quality corrections based on input fluctuations
   */
  async generateProactiveCorrections(
    currentData: DashboardData,
    fluctuations: any[],
    historicalTrends: any[]
  ): Promise<GeminiResponse> {
    const prompt = `
PROACTIVE QUALITY CORRECTIONS ANALYSIS:

OBJECTIVE: Generate specific corrective actions to prevent quality issues based on detected input fluctuations.

CURRENT PLANT DATA:
- Quality Score: ${currentData.plant_overview.quality_score_avg.toFixed(1)}/10
- Overall Efficiency: ${currentData.plant_overview.overall_efficiency.toFixed(1)}%
- Production Rate: ${currentData.plant_overview.production_rate_current.toFixed(0)} TPH
- Energy Consumption: ${currentData.plant_overview.energy_consumption_current.toFixed(1)} kWh/ton

CRITICAL PROCESS PARAMETERS:
- Kiln Temperature: ${currentData.current_parameters.kiln_temperature.toFixed(0)}°C
- Raw Mill Power: ${currentData.current_parameters.raw_mill_power.toFixed(0)} kW
- Cement Mill Power: ${currentData.current_parameters.cement_mill_power.toFixed(0)} kW
- Raw Meal Flow: ${currentData.current_parameters.raw_meal_flow.toFixed(1)} TPH
- Alternative Fuel Rate: ${currentData.current_parameters.alternative_fuel_rate.toFixed(1)}%

DETECTED FLUCTUATIONS:
${fluctuations.length > 0 ? 
  fluctuations.map(f => `- ${f.parameter}: ${f.current_value} (${f.deviation_percent?.toFixed(1)}% deviation, ${f.severity} severity)`).join('\n') :
  '- No significant fluctuations detected'
}

PROVIDE PROACTIVE QUALITY CORRECTIONS:

1. IMMEDIATE CORRECTIVE ACTIONS (0-15 minutes):
   - Parameter adjustments to prevent quality drift
   - Critical control interventions
   - Operator alert priorities

2. PREVENTIVE MEASURES (15 minutes - 1 hour):
   - Process stabilization steps
   - Quality assurance checkpoints
   - Monitoring intensification areas

3. ROOT CAUSE ELIMINATION (1-4 hours):
   - Systematic parameter optimization
   - Process control improvements
   - Quality consistency enhancement

4. PREDICTIVE PREVENTION (4+ hours):
   - Long-term stability measures
   - Quality control system optimization
   - Continuous improvement actions

5. SUCCESS VALIDATION:
   - Key quality indicators to monitor
   - Expected improvement timelines
   - Quality consistency metrics

6. RISK MITIGATION:
   - Potential side effects of corrections
   - Safety considerations
   - Process stability risks

Focus on actionable, specific corrections that plant operators can implement immediately to ensure quality consistency.
`;

    return this.askGemini(prompt, currentData);
  }

  /**
   * Analyze input parameter fluctuations and stability
   */
  async analyzeInputFluctuations(
    parameters: ProcessParameters,
    thresholds: any,
    historicalData: any[]
  ): Promise<GeminiResponse> {
    const prompt = `
INPUT FLUCTUATION STABILITY ANALYSIS:

CURRENT PARAMETERS:
- Kiln Temperature: ${parameters.kiln_temperature.toFixed(0)}°C
- Raw Mill Power: ${parameters.raw_mill_power.toFixed(0)} kW  
- Cement Mill Power: ${parameters.cement_mill_power.toFixed(0)} kW
- Raw Meal Flow: ${parameters.raw_meal_flow.toFixed(1)} TPH
- Alternative Fuel Rate: ${parameters.alternative_fuel_rate.toFixed(1)}%
- Clinker Temperature: ${parameters.clinker_temperature.toFixed(0)}°C
- Exhaust Fan Speed: ${parameters.exhaust_fan_speed.toFixed(0)} RPM

STABILITY ANALYSIS REQUEST:

1. FLUCTUATION ASSESSMENT:
   - Parameter stability evaluation
   - Deviation from optimal ranges
   - Trend analysis and patterns

2. IMPACT PREDICTION:
   - Quality impact assessment
   - Production efficiency effects
   - Energy consumption implications

3. STABILIZATION RECOMMENDATIONS:
   - Immediate control actions
   - Parameter tuning strategies
   - Process optimization steps

4. MONITORING PRIORITIES:
   - Critical parameters to watch
   - Alert threshold recommendations
   - Quality assurance checkpoints

5. PREVENTIVE MEASURES:
   - Proactive control strategies
   - Process improvement opportunities
   - Long-term stability enhancement

Provide specific guidance for maintaining input parameter stability and ensuring consistent cement quality.
`;

    return this.askGemini(prompt);
  }
}

// Factory function to create Gemini service instance
export function createGeminiService(): GeminiService {
  const apiKey = process.env.GEMINI_API_KEY || 'demo-key';
  
  if (!apiKey || apiKey === 'demo-key') {
    console.warn('⚠️ WARNING: Gemini API key not found. Using demo mode.');
  } else {
    console.log('✅ Gemini API initialized successfully');
  }
  
  return new GeminiService(apiKey);
}