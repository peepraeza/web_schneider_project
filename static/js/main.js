function setSidebarActive(v){
  $(document).ready(function(){
    setTimeout(function(){
      $(".sidebar-item").removeClass("selected")
      $(".sidebar-link").removeClass("active")
      $($(".sidebar-item")[v]).addClass("selected")
      $($(".sidebar-link")[v]).addClass("active")
    }, 10)
  })
}

// function 