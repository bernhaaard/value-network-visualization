# Coding & Analysis Instructions PVQ-RR

The PVQ-RR is available at no cost for academic research purposes.

**For commercial use, a license is required.**

Contact <shalom.schwartz@huji.ac.il> to obtain a license.

## Scoring and Analysis Instructions

June 2021

For a presentation of the theory underlying the PVQ-RR and validating data, see Schwartz, et al. (2012), Schwartz (2017), and Schwartz & Cieciuch (2021), in the references below. For instructions for different types of statistical analysis, see below 'correcting for scale use bias'. In languages that distinguish gender grammatically, the separate Male and Female versions should be used.

## Scoring Key for 19 Narrower Basic Values in the PVQ-RR Value Scale

| Value                    | Items     | Value                    | Items     |
|--------------------------|-----------|--------------------------|-----------|
| Self-direction Thought   | 1,23,39   | Tradition                | 18,33,40  |
| Self-direction Action    | 16,30,56  | Conformity-Rules         | 15,31,42  |
| Stimulation              | 10,28,43  | Conformity-Interpersonal | 4,22,51   |
| Hedonism                 | 3,36,46   | Humility                 | 7,38,54   |
| Achievement              | 17,32,48  | Universalism-Nature      | 8,21,45   |
| Power Dominance          | 6,29,41   | Universalism-Concern     | 5,37,52   |
| Power Resources          | 12,20,44  | Universalism-Tolerance   | 14,34,57  |
| Face                     | 9,24,49   | Benevolence-Care         | 11,25,47  |
| Security Personal        | 13,26,53  | Benevolence-Dependability| 19,27,55  |
| Security Societal        | 2,35,50   |                          |           |

## Scoring Key for 10 Original Broad Basic Values with the PVQ-RR Value Scale

| Value                    | Items     |
|-------------------------|------------|
| Self-Direction | 1,23,39,16,30,56 |
| Stimulation | 10,28,43 |
| Hedonism | 3,36,46 |
| Achievement | 17,32,48 |
| Power | 6,29,41,12,20,44 |
| Security | 13,26,53,2,35,50 |
| Conformity | 15,31,42,4,22,51 |
| Tradition | 18,33,40,7,38,54 |
| Benevolence | 11,25,47,19,27,55 |
| Universalism | 8,21,45,5,37,52,14,34,57 |

_______________________________________________________________________________

## Scoring Key for four Higher Order Values in the PVQ-RR Value Scale

**Self-Transcendence** Combine means for universalism-nature, universalism-concern, universalism-tolerance, benevolence-care, and benevolence-dependability

**Self-Enhancement** Combine means for achievement, power dominance and power resources

**Openness to change** Combine means for self-direction thought, self-direction action, stimulation and hedonism

**Conservation** Combine means for security-personal, security-societal, tradition, conformity-rules, conformity-interpersonal

Humility and Face are best treated as separate values because they are on the borders between self-transcendence and conservation (humility) and of self-enhancement and conservation (face). Structural analyses (MDS) can reveal whether these two values could be added to the higher order values to increase reliability in your samples. Analyses in about 100 samples so far indicate that humility is best combined with self-transcendence in about 70% and with conservation in about 30% of samples. Face is best combined with self-enhancement in 50% and with conservation in 50% of samples.

## Correcting for scale use biases

The score for each value is the mean of the raw ratings given to the items listed above for that value. For many types of analyses, it is highly desirable to make a correction for individual differences in use of the response scale.**<sup>1</sup>** Below are instructions indicating whether a correction is appropriate for each type of analysis and how to make the correction. **Failure to make the scale use correction when appropriate may lead to mistaken conclusions!**

Individuals and cultural groups differ in their use of the response scale.**<sup>2</sup>** Scale use differences often distort findings and lead to incorrect conclusions.**<sup>3</sup>** To correct for scale use:

(A) Compute scores for the 19 values by taking the means of the items that index it (above). If you wish to check internal reliabilities, do so for these value scores before the next steps.

(B) Compute each individual's mean score across <u>all</u> 57 value items. This is the individual's Mean RATing of all values. Call this MRAT.<sup>**4**</sup>

(C) Subtract MRAT from each of the 19 value scores. This centers the scores of each of the individual's 19 values (computed in A) around that individual's Mean (MRAT).

1. *For correlation analyses*: Use the centered value scores (C).

2. *For group mean comparisons, analysis of variance or of covariance (t-tests, ANOVA, MANOVA, ANCOVA, MANCOVA)*: Use the centered value scores as dependent variables.

3. <u>For regression</u>:

   a. If the value is your **dependent** variable, use the centered value score.

   b. If the values are **predictor** variables:

      i. Enter **<u>un</u>**centered values as predictors in the regression.

         a) If all 19 values are included, the single regression coefficients for the values are not clearly interpretable because the values are completely interdependent. This is so even if the multicollinearity statistics do not look problematic.
         
         b) If only some of the values are relevant to the topic, include only those *a priori*, to reduce interdependence and obtain more interpretable regression coefficients.

      ii. If you are interested **<u>only</u>** in the total variance accounted for by values and not in the regression coefficients, you may include all 19 **<u>un</u>**centered values as predictors. The R<sup>2</sup> is meaningful but, because the 19 values are exactly linearly dependent, the coefficients for each value are not precisely interpretable.

      iii. If you use only one value as a predictor, use the centered value because this is equivalent to correlation.

   c. In publications, it is advisable to provide a table with the correlations between the centered values and the dependent variables in addition to the regression results. These correlations will aid in understanding results and reduce confusion due either to multicolinearity or to intercorrelations among the values.

4. *For multidimensional scaling (MDS),* both centered and uncentered item responses work equally well.

5. *For SEM and for canonical, discriminant, or confirmatory factor analyses:*

   Use **raw** (uncentered) value scores for the items or for the 19 value means.<sup>5</sup>

6. *Exploratory factor analysis* is not suitable for discovering the theorized set of relations among values because they form a quasi-circumplex, which EFA does not reveal. Factors obtained in an EFA with rotation will only partly overlap with the 19 values, will exploit chance associations, and will combine them to form larger factors. The first *unrotated* factor represents the way respondents use the response scale. It may represent an acquiescence bias, social desirability, the overall importance of values to the person, or some combination of these and other influences. It does not represent specific value preferences. A crude representation of the circular structure of values can be obtained using EFA by plotting the value items in a two-dimensional space according to their loadings on factors 2 and 3 of the *unrotated* solution.

## Footnotes

1. For a review of some conceptual and statistical issues in correcting for scale use with basic values, including a simulation of the effects of the simple method of centering (ipsatizing), see Rudnev (2021). Other methods that correct for scale use may also be used (e.g., Van Rosemalen et al., 2010).

2. For a discussion of the general issue, see Saris (1988). Rudnev (2021) summarizes studies that examine meanings of such scale use as an individual difference variable. Smith (2004) discusses correlates of scale use differences at the level of cultures.

3. Two critical assumptions underlie these corrections.

   1. The motivational circle captured by the set of 19 individual level values is reasonably comprehensive of the full motivational space of values recognized across individuals and cultural groups. Empirical evidence supports this assumption (Schwartz, 1992, 2004; Schwartz & Cieciuch, 2021).

   2. Studies of value priorities are concerned with the importance of particular values as part of the value system of a person or group. This is because the way values affect cognition, emotion, and behavior is through a trade-off or balancing among multiple values that are simultaneously relevant to a decision or action (cf. Schwartz et al., 2016). The relevant values often have opposing implications for the decision or action. The absolute importance of a single value across individuals or across groups ignores the fact that values function as a system (Schwartz, 1996). The scale use correction converts absolute value scores into scores that indicate the relative importance of each value in the value system, i.e., the individual's value priorities.

4. We center within person rather than standardizing (i.e., we do not divide by individuals' standard deviation across the 57 items). This is because individual differences in variances of value ratings are usually meaningful. Even if, on average, individuals attribute the same mean importance to the set of values, some individuals discriminate more sharply among their values and others discriminate less sharply. Standardizing that makes everyone's variance the same (i.e., 1) would eliminate these real differences in the extent to which individuals discriminate among their values

5. Centering creates a small degree of linear dependence among the items. This may be problematic in these analyses. The scale use problem is avoided or eliminated by other aspects of these analyses without centering. See Closs (1996) and Cornwell & Dunlop (1994).

## References [starred are available as electronic files]

Closs, S. J. (1996). On the factoring and interpretation of ipsative data. *Journal of Occupational and Organizational Psychology, 69,* 41-47.

Cornwell, J. M., & Dunlop, W. P. (1994). On the questionable soundness of factoring ipsative data: A response to Saville and Willson (1991). *Journal of Occupational and Organizational Psychology, 67,* 89-100.

Van Rosmalen J, Van Herk H, Groenen PJF. (2010) Identifying response styles: A latent-class bilinear multinomial logit model. *Journal of Marketing Research, 47,* 157–172.

Rudnev M. (2021) Caveats of non-ipsatization of basic values A review of issues and a simulation study. *Journal of Research in Personality, 93*, 104-118.

Saris, W. E. (Ed) (1988). *Variation in response functions, A source of measurement error in attitude research.* Amsterdam: Sociometric Research Foundation.

*Schwartz, S. H. (1992). Universals in the content and structure of values: Theory and empirical tests in 20 countries. In M. Zanna (Ed.), *Advances in experimental social psychology (Vol. 25)* (pp. 1-65). New York: Academic Press.

*Schwartz, S.H. (1996). Value priorities and behavior: Applying a theory of integrated value systems. In C. Seligman, J.M. Olson, & M.P. Zanna (Eds.), *The Psychology of Values: The Ontario Symposium, Vol. 8* (pp.1-24). Hillsdale, NJ: Erlbaum.

*Schwartz, S. H., Cieciuch, J., Vecchione, M., Torres, C., Dirilem-Gumus, O., & Butenko, T. (2016). Value tradeoffs and behavior in four countries: Validating 19 refined values. *European Journal of Social Psychology*

*Schwartz, S. H. (2017). The refined theory of basic values. In S. Roccas & L. Sagiv (Eds.), *Values and behavior: Taking a cross-cultural perspective,* Springer.

*Schwartz, S.H., Cieciuch, J., Vecchione, M., Davidov, E., Fischer, R., Beierlein, C., Ramos, A., Verkasalo, M., Lönnqvist, J.-E., Demirutku, K., Dirilen-Gumus, O., & Konty, M. (2012). Refining the theory of basic individual values. *Journal of Personality and Social Psychology,* *103,* 663-688.

*Schwartz, S. H., & Cieciuch, J. (in press). Measuring the refined theory of individual values in 49 cultural groups: Psychometrics of the revised portrait value questionnaire. *Assessment*

Smith, P. B. (2004). Acquiescent response bias as an aspect of cultural communications style. *Journal of Cross-Cultural Psychology, 35,* 50-61.
