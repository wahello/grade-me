using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GradeMe3.Emails
{
    public class Letter
    {
        public MailboxAddress To { get; set; }
        public MailboxAddress From { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
    }
}
