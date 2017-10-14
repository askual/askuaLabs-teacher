/**/
$(document).ready(function(){
    $('.button-collapse').sideNav({
        menuWidth: 250
    });
	

     $('select').material_select();
	 $('.btn-close').click(function(){
        	swal({
        		title: "Are you sure?",
        		
        		type: "warning",
        		showCancelButton: true,
        		confirmButtonColor: '#ff5252',
        		confirmButtonText: 'Yes, Exit',
        		closeOnConfirm: false
        	},
        	function(){
        		//exit nw function 
        		swal("Deleted!", "Your imaginary file has been deleted!", "success");
        	});
        });
  
    $('.tooltipped').tooltip({delay: 50});

    //modal
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      ready: function() { 
      //alert('Ready'); 
      }, // Callback for Modal open
      complete: function() { 
      //alert('Closed'); 
      } // Callback for Modal close
  });


    
 

});
