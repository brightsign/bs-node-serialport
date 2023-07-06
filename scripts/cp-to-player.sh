# List of required and optional environment variables
required_vars=("PLAYER")
optional_vars=("PLAYER_PW")

# Iterate over the required variables
for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "ERROR: Environment variable $var is not set."
    exit 1
  fi
done

# Iterate over the required variables
for var in "${optional_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "INFO: Environment variable $var is not set. Consider whether $var needs to be set."
  fi
done

echo "copying files to $PLAYER"

# add digest auth when DWS password is set
if [ -z $PLAYER_PW ]; then 
  AUTH=""
else 
  AUTH="--digest --user admin:$PLAYER_PW"
fi
echo "AUTH: $AUTH"

# fi
for f in *.html src/*.js src/autorun.brs 
do
	echo $f
	curl $AUTH --location --request PUT "http://$PLAYER/api/v1/files/sd" --form "=@"$f"" | jq -r .data
done

for f in dist/*
do
	echo $f
	curl $AUTH --location --request PUT "http://$PLAYER/api/v1/files/sd/dist" --form "=@"$f"" | jq -r .data
done
