using System.Collections.Generic;
using GradeMe3.Controllers;

namespace GradeMe3.Database
{
    public class IdComparer<T> : IEqualityComparer<T> where T: IPk
    {
        public bool Equals(T x, T y)
        {
            return x.Id == y.Id;
        }

        public int GetHashCode(T obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}