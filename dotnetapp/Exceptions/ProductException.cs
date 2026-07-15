
namespace dotnetapp.Exceptions
{
    
    public class ProductException : System.Exception
    {
        public ProductException() { }
        public ProductException(string message) : base(message) { }
        public ProductException(string message, System.Exception inner) : base(message, inner) { }
       
    }
   
}