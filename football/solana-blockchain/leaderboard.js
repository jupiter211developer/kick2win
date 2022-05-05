$(document).ready(function(){
        var csrf = $("#csrf_token").val();

        function fetch_game() {
                var csrf = $("#csrf_token").val();
                $.post('server/api.php',{cmd:'fetch_game',csrf:csrf},function(resp){
                        $('#leaderboard').html(resp);
                });
        }
        fetch_game();
        setInterval(function(){
                fetch_game();
        },5000);
});
