(function ($) {
  'use strict'

  // Preloader js
  $(window).on('load', function () {
    $('.preloader').fadeOut(100)
  })

  // Sticky Menu
  $(window).scroll(function () {
    if ($('.navigation').offset().top > 100) {
      $('.navigation').addClass('nav-bg')
    } else {
      $('.navigation').removeClass('nav-bg')
    }
  })

  // Background-images
  $('[data-background]').each(function () {
    $(this).css({
      'background-image': 'url(' + $(this).data('background') + ')'
    })
  })

  // background color
  $('[data-color]').each(function () {
    $(this).css({
      'background-color': $(this).data('color')
    })
  })

  // progress bar
  $('[data-progress]').each(function () {
    $(this).css({
      'bottom': $(this).data('progress')
    })
  })

  /* ########################################### hero parallax ############################################## */
  /*
  window.onload = function () {
    var parallaxBox = document.getElementById('parallax')
    if (!parallaxBox) return
    var
      c1left = document.getElementById('l1').offsetLeft

    var c1top = document.getElementById('l1').offsetTop

    var c2left = document.getElementById('l2').offsetLeft

    var c2top = document.getElementById('l2').offsetTop

    var c3left = document.getElementById('l3').offsetLeft

    var c3top = document.getElementById('l3').offsetTop

    var c4left = document.getElementById('l4').offsetLeft

    var c4top = document.getElementById('l4').offsetTop

    var c5left = document.getElementById('l5').offsetLeft

    var c5top = document.getElementById('l5').offsetTop

    var c6left = document.getElementById('l6').offsetLeft

    var c6top = document.getElementById('l6').offsetTop

    var c7left = document.getElementById('l7').offsetLeft

    var c7top = document.getElementById('l7').offsetTop

    var c8left = document.getElementById('l8').offsetLeft

    var c8top = document.getElementById('l8').offsetTop

    var c9left = document.getElementById('l9').offsetLeft

    var c9top = document.getElementById('l9').offsetTop

    parallaxBox.onmousemove = function (event) {
      event = event || window.event
      var x = event.clientX - parallaxBox.offsetLeft

      var y = event.clientY - parallaxBox.offsetTop

      mouseParallax('l1', c1left, c1top, x, y, 25)
      mouseParallax('l2', c2left, c2top, x, y, 25)
      mouseParallax('l3', c3left, c3top, x, y, 20)
      mouseParallax('l4', c4left, c4top, x, y, 35)
      mouseParallax('l5', c5left, c5top, x, y, 30)
      mouseParallax('l6', c6left, c6top, x, y, 45)
      mouseParallax('l7', c7left, c7top, x, y, 30)
      mouseParallax('l8', c8left, c8top, x, y, 25)
      mouseParallax('l9', c9left, c9top, x, y, 40)
    }
  }

  function mouseParallax (id, left, top, mouseX, mouseY, speed) {
    var obj = document.getElementById(id)
    var parentObj = obj.parentNode

    var containerWidth = parseInt(parentObj.offsetWidth)

    var containerHeight = parseInt(parentObj.offsetHeight)
    obj.style.left = left - (((mouseX - (parseInt(obj.offsetWidth) / 2 + left)) / containerWidth) * speed) + 'px'
    obj.style.top = top - (((mouseY - (parseInt(obj.offsetHeight) / 2 + top)) / containerHeight) * speed) + 'px'
  }

  */
  /* ########################################### /hero parallax ############################################## */

})(jQuery)
