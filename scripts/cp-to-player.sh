if [ $# -eq 0 ]; then
# use the variables in the environment
echo "copying files to $PLAYER"
else
PLAYER=$1
PLAYER_PW=$2
fi
for f in *.html src/*.js src/autorun.brs 
do
	echo $f
	curl --location --request PUT "http://$PLAYER/api/v1/files/sd" --form "=@"$f"" | jq -r .data.result.results[0]
done

for f in dist/*
do
	echo $f
	curl --location --request PUT "http://$PLAYER/api/v1/files/sd/dist" --form "=@"$f"" | jq -r .data.result.results[0]
done
