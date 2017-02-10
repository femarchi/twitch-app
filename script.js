$(document).ready(function() {

	var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
	var dataArray = [];
	var template = document.getElementById('streamer-data-template').content;
	var statusFilter = 'all';

	getJsonArray();

	function getJsonArray(){

		$.each(streamers,function(i, user){

			var channelRequestUrl = 'https://wind-bow.gomix.me/twitch-api/channels/' + user + '/';
			var streamRequestUrl = 'https://wind-bow.gomix.me/twitch-api/streams/' + user + '/';

			$.when(
				$.ajax({
					type:'GET',
					dataType: 'jsonp',
					url: channelRequestUrl,
					success: function(result){
						//console.log('user data request successful');
					}
				}),
				$.ajax({
					type:'GET',
					dataType: 'jsonp',
					url: streamRequestUrl,
					success: function(result){
						//console.log('stream data request successful');
					}
				})).done(function(channelData, streamData){
					// console.log('user: ' + userData[0].name + 
					// 						'\n logo: ' + userData[0].logo +
					// 						'\n stream ' + streamData[0].stream);
					dataArray.push({
						name:user,
						logo:channelData[0].logo,
						stream:streamData[0].stream,
						status:channelData[0].status,
						url:channelData[0].url
					});

					if(dataArray[i] != undefined && dataArray[i] != null){
						addStream(dataArray[i]);
					}
			});

		}); //end of $.each()
	} //end of getJsonArray()

	$(document).on('click', '#all-filter', function(){
		$("#choice-box").css("left", '0');
		$("#choice-box p").html("ALL");
		statusFilter = 'all';
		filterStreams(statusFilter, '');
	});

	$(document).on('click', '#online-filter', function(){
		$("#choice-box").css("left", '33.4%');
		$("#choice-box p").html("ONLINE");
		statusFilter = 'online';
		filterStreams(statusFilter, '');
		//addStream(dataArray[0]);
	});

	$(document).on('click', '#offline-filter', function(){
		$("#choice-box").css("left", '66.7%');
		$("#choice-box p").html("OFFLINE");
		statusFilter = 'offline';
		filterStreams(statusFilter, '');
	});

	$(document).on('click', '#search-icon', function(){
		searchInput = $('#search-bar').val();
		filterStreams(statusFilter, searchInput);
	});

	$(document).keypress(function(event){
    if(event.which === 13){
    	event.preventDefault();
     $('#search-icon').click();
     //pressing enter functions as as click on search btn
    }
});

	function filterStreams(filter, searchInput){

		$('#player-list').html("");

		switch(filter) {
			case 'online':
				$.each(dataArray, function(i, element){
					if(element.stream != null){
						if(searchInput == '' || searchInput == element.name){
							addStream(element);
						}
					}
				});
				break;

			case 'offline':
				$.each(dataArray, function(i, element){
					if(element.stream == null){
						if(searchInput == '' || searchInput == element.name){
							addStream(element);
						}
					}	
				});
				break;

			case 'all':
				$.each(dataArray, function(i, element){
					if(searchInput == '' || searchInput == element.name){
						addStream(element);
					}
				});
				break;

		}

	}

	function addStream(streamData){

		clonedTemplate = template.cloneNode(true);

		if(streamData.status == 404){

			$(clonedTemplate).find('a').attr('href', "#");
			$(clonedTemplate).find('img').attr('src', "#");
			$(clonedTemplate).find('.player-name').html(streamData.name);
			$(clonedTemplate).find('i').addClass('fa-exclamation');
			$(clonedTemplate).find('.stream-data').html("Channel not found.");

		}else{
			$(clonedTemplate).find('a').attr('href', streamData.url);
			$(clonedTemplate).find('img').attr('src', streamData.logo);
			$(clonedTemplate).find('.player-name').html(streamData.name);
			if(streamData.stream != null){
				$(clonedTemplate).find('i').addClass('fa-check');
				$(clonedTemplate).find('.stream-data').html(streamData.status);
			} else {
				$(clonedTemplate).find('i').addClass('fa-times');
			}
		}

		document.getElementById('player-list').appendChild(clonedTemplate);
	}


}); //end of $(document).ready();


