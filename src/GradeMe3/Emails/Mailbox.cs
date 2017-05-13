namespace GradeMe3.Emails
{
    public class Mailbox
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string SmtpUrl { get; set; }
        public int SmtpPort { get; set; }
    }
}