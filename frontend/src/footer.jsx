function Footer(){
 return(

<footer className="bg-dark text-light py-3 px-4">
  <div className="d-flex justify-content-between align-items-center">
    <span>&copy; {new Date().getFullYear()} Documentation System. </span>
    <span>All rights reserved.</span>
  </div>
</footer>
 )
}

export default Footer;