using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace OnboardingTask.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        [Range(0, 999.99)]
        public string Price { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
