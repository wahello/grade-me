using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.Emails
{
    public class EmailSendRequest
    {
        public IEnumerable<Letter> Letters { get; set; }
        public string SmtpUrl { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUserName { get; set; }
        public string SmtpPassword { get; set; }
    }
}
