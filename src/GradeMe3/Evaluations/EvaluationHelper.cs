using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.Evaluations
{
    public static class EvaluationHelper
    {
        public static Evaluation LatestEvaluation(IEnumerable<Evaluation> evaluations)
        {
            var list = evaluations.ToList();
            list.Sort((a, b) => b.Time.CompareTo(a.Time));
            return list.FirstOrDefault();
        }        
    }
}
