/**
 * Recommendation Engine for Sales Lab
 * Calculates product suitability and upselling potential based on customer traits.
 */

import { TRAIT_WEIGHTS } from '../constants/salesLabData';

export const recommendationEngine = {
    /**
     * Calculates scores for each product family based on traits and persona.
     * @param {Array} traits - List of selected trait objects (e.g., [{ id: 'price_sensitive', ... }])
     * @param {Object} persona - Selected persona object
     * @param {Object} difficulty - Selected difficulty object
     * @returns {Object} - { scores: { OLED: number, ... }, bestMatch: string, alternative: string }
     */
    calculateProductScores: (traits, persona) => {
        // Initialize scores
        let scores = {
            OLED: 0,
            MRGB: 0, // QNED MiniLED
            QNED: 0, // Standard QNED
            UHD: 0
        };

        // 1. Base Score from Traits
        traits.forEach(trait => {
            const weights = TRAIT_WEIGHTS[trait.id];
            if (weights) {
                scores.OLED += weights.OLED || 0;
                scores.MRGB += weights.MRGB || 0;
                scores.QNED += weights.QNED || 0;
                scores.UHD += weights.UHD || 0;
            }
        });

        // 2. Persona Adjustments
        if (persona) {
            if (persona.id === 'premium_lifestyle') {
                scores.OLED += 2;
                scores.MRGB += 1;
            } else if (persona.id === 'budget_seeker') {
                scores.UHD += 3;
                scores.QNED += 1;
                scores.OLED -= 2;
            } else if (persona.id === 'gamer') {
                scores.OLED += 3; // OLED is king for gaming
                scores.MRGB += 2;
            }
        }

        // 3. Determine Best and Alternative Matches
        // Convert to array for sorting: [['OLED', 5], ['QNED', 3], ...]
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

        return {
            scores,
            bestMatch: sortedScores[0][0],
            alternative: sortedScores[1][0]
        };
    },

    /**
     * Calculates the potential for upselling to a larger screen size.
     * @param {Array} traits - List of selected trait objects
     * @param {Object} persona - Selected persona object
     * @param {String} age - Selected age group (e.g., "40s")
     * @returns {Object} - { score: number, recommendation: 'Strong' | 'Soft' | 'None' }
     */
    calculateUpsellScore: (traits, persona, age) => {
        let score = 1; // Base score increased to 1 (Trend is Large)

        // Persona Factors
        if (persona) {
            if (['premium_lifestyle', 'gamer', 'family_user'].includes(persona.id)) {
                score += 2;
            }
            if (persona.id === 'budget_seeker') {
                score -= 2; // Reduced penalty
            }
        }

        // Trait Factors
        const traitIds = traits.map(t => t.id);
        if (traitIds.includes('design_focused')) score += 1;
        if (traitIds.includes('environment_sensitive')) score += 1;
        if (traitIds.includes('movie_lover')) score += 2; // Strong driver
        if (traitIds.includes('sports_fan')) score += 2; // Strong driver
        if (traitIds.includes('social_host')) score += 2; // Strong driver
        if (traitIds.includes('price_sensitive')) score -= 2;

        // Demographic Factors
        if (['30s', '40s', '50s'].includes(age)) score += 1; // Expanded age range

        // Determine Recommendation Level
        let recommendation = 'None';
        if (score >= 3) {
            recommendation = 'Strong'; // 75"+ Highly Recommended
        } else if (score >= 1) {
            recommendation = 'Soft'; // Mention 75" as option
        }

        return {
            score,
            recommendation
        };
    }
};
