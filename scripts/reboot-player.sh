if [ $# -eq 0 ]; then
# use the variables in the environment
echo "rebooting $PLAYER"
else
PLAYER=$1
PLAYER_PW=$2
fi
for f in *.html src/*.js src/autorun.brs 
do
	echo $f
	curl --location --request PUT "http://$PLAYER/api/v1/control/reboot" --form "=@"$f"" | jq -r .data.result.results[0]
done
