import React from 'react';
import './styles.css';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
const colorList = {
	water: ["#4EBAE9", "#459abf", "#7bc3e3"],
	fire: ["#eb6607", "#731212", "#e32b2b"],
	normal: ["#E0CFB9", "#ad9f8c", "#deceb8"],
	grass: ["#7AC815", "#518709", "#a3ed40"],
	electric: ["#F3E135", "#cfbf29", "#f7e640"],
	ice:["#61C1EC", "#377e9e", "#82d1f5"],
	fighting: ["#E09230", "#b57424", "#f0a64a"],
	poison: ["#7A4F9F", "#4d2e69", "#724699"],
	ground: ["#E5750D", "#a8570a", "#de7e23"],
	flying: ["#EBECE6", "#bbbdb5", "#ecede8"],
	psychic: ["#AF72B3", "#8b548f", "#b98cbd"],
	bug: ["#B6D36C", "#8aa34b", "#c9e386"],
	rock: ["#E08830", "#a15e1b", "#e6a05a"],
	ghost: ["#A84DC2", "#6d2e80", "#a756bf"],
	dark: ["#355e69", "#152f36", "#2d525c"],
	dragon: ["#AFAA13", "#7a770f", "#9e9a1c"],
	steel: ["#8F968F", "#717571", "#a8ada8"],
	fairy: ["#DC4785", "#9c305d", "#bf4176"]
}
const Pokemondisplay = (props) =>{
	return(
		<div class = "card" style={{backgroundColor: props.color[0]}}>
			<div class = "header">
				<div class = "pokeName"> {props.name.charAt(0).toUpperCase() + props.name.slice(1)} </div>
				{props.singleType ?
					<div class = "pokeTypes">
					<img class = "pokeType" src={require(`./${props.type1.charAt(0).toUpperCase()+ props.type1.slice(1)}type.ico`)} />
					</div>
					:
					<div class = "pokeTypes">
					<img class = "pokeType" src={require(`./${props.type1.charAt(0).toUpperCase()+ props.type1.slice(1)}type.ico`)} />
					<img class = "pokeType" src={require(`./${props.type2.charAt(0).toUpperCase()+ props.type2.slice(1)}type.ico`)} />
					</div>
					/*<div class = "pokeType"> {props.type1.charAt(0).toUpperCase()+ props.type1.slice(1)} {props.type2.charAt(0).toUpperCase() + props.type2.slice(1)}</div>*/
				}
			</div>
			<div class = "pokeBox" style={{backgroundImage: `linear-gradient(to left, ${props.color[1]}, ${props.color[2]})`}}>
				<img class = "pokeImage" src = {props.image} />
			</div>
			<div class = "pokeMoves">
				<div class = "pokeMove"> 
					<div class = "moveName ability"> Ability: {props.ability} </div>
					{props.abilityDesc}
				</div>
			<div class = "pokeMove"> 
				<div class = "moveName"> {props.move1} </div>
				{props.move1Desc} </div>
				{props.singleMove ?
					<div class = "pokeMove"> </div>:
					<div class = "pokeMove"> 
						<div class = "moveName"> {props.move2} </div>
						{props.move2Desc} 
					</div>
				}	
			</div>
		</div>
	)
}
const InputForm = () => {
	const [title, updateTitle] = useState('');
	const [image, updateImage] = useState('');
	const [name, updateName] = useState('');
	const [ability, updateAbility] = useState(null);
	const [abilityDesc, updateAbilityDesc] = useState(null);
	const [move1, updateMove] = useState('');
	const [move2, updateMove2] = useState('');
	const [move1Desc, updateMove1Desc] = useState('');
	const [move2Desc, updateMove2Desc] = useState('');
	const [type, updateType] = useState('');
	const [type2, updateType2] = useState('');
	const [singleType, updateSingularType] = useState(true);
	const [displayCard, updateDisplay] = useState(false);
	const [singleMove, updateSingle] = useState(false);
	const [cardColor, changeColor] = useState("normal");
	const [error, setError] = useState(null);
	const handleError = response => {
		if (!response.ok) { 
			throw Error(response.statusText);
		} else {
			return response.json();
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {title};
		console.log(data);
		fetch(`https://pokeapi.co/api/v2/pokemon/${title.toLowerCase()}`)
			.then(response => {
				if (!response.ok){
					throw Error('Sorry. Something went wrong. \n Please check your spelling or try a different Pokemon');
				}
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.sprites == undefined) {
					throw Error("Sorry. Something went wrong. Please check your spelling or try a different Pokemon");
				}
				if (data.sprites.other.dream_world.front_default){
					updateImage(data.sprites.other.dream_world.front_default);
				}
				else if (data.sprites.other["official-artwork"].front_default){
					updateImage(data.sprites.other["official-artwork"].front_default);
				}else{
					updateImage(data.sprites.front_default);
				}
				changeColor(data.types[0].type.name);
				//updateImage(`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${data.id}.svg`);
				updateName(data.name);
				let ability = data.abilities[Math.floor(Math.random()*data.abilities.length)].ability;
				updateAbility(toTitleCase(ability.name));
					fetch(ability.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let i = 0;
							let abilityDesc = data.flavor_text_entries[i].flavor_text;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								abilityDesc = data.flavor_text_entries[i].flavor_text;
							}
							updateAbilityDesc(abilityDesc);
						});
				if (data.types.length == 2){
					let type1 = data.types[0].type.name;
					let type2 = data.types[1].type.name;
					updateType(type1);
					updateType2(type2);
					updateSingularType(false);
				} else{
					console.log(data.types[0].type.name)
					const types = data.types[0].type.name;
					updateType(types);
					updateSingularType(true);
				}
				if (data.moves.length == 1){
					updateSingle(true);
					const move = data.moves[0].move;
					move.name = move.name.replace(/-/g, ' ');
					let moveDesc;
					fetch(move.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let i = 0;
							let moveDesc = data.flavor_text_entries[i].flavor_text;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								moveDesc = data.flavor_text_entries[i].flavor_text;
							}
							updateMove1Desc(moveDesc);
						});
					updateMove(toTitleCase(move.name));
					updateDisplay(true);
				}else{
					updateSingle(false);
					let move = data.moves[Math.floor(Math.random()*data.moves.length)].move;
					let move2 = data.moves[Math.floor(Math.random()*data.moves.length)].move;
					while (move2 == move){
						move2 = data.moves[Math.floor(Math.random()*data.moves.length)].move.name;
					}
					fetch(move.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let i = 0;
							let moveDesc = data.flavor_text_entries[i].flavor_text;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								moveDesc = data.flavor_text_entries[i].flavor_text;
							}
							updateMove1Desc(moveDesc);
						});
					fetch(move2.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let move2Desc = data.flavor_text_entries[1].flavor_text;
							let i = 0;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								move2Desc = data.flavor_text_entries[i].flavor_text;
							}
							updateMove2Desc(move2Desc);
						});
					console.log(move2);
					move.name = move.name.replace(/-/g, ' ');
					move2.name = move2.name.replace(/-/g, ' ');
					updateMove(toTitleCase(move.name));
					updateMove2(toTitleCase(move2.name));
					updateDisplay(true);

				}
			})
			.catch(err => {
				updateDisplay(false);
				setError(err.message);
			});
	}
		return(
			<div>
				<div class = "welcome"> 
			<div>Welcome to the Pokemon Card Generator.</div> 
			<div> To use, simply type the name of any Pokemon and press the Pokeball to generate a Pokemon Card. </div>
			</div>
			<div class = "mainDiv">
				<div>
			{displayCard ? 
			
				<div>
					<Pokemondisplay singleType = {singleType} move1Desc = {move1Desc} singleMove = {singleMove} move2Desc = {move2Desc} type1 = {type} 
					type2 = {type2} name = {name} image = {image} color = {colorList[cardColor]} move1 = {move1} move2 = {move2} ability = {ability} abilityDesc = {abilityDesc}/>
				</div>
				:
				 <div> {error} </div>
			}
			<div>
				<form class = "submitForm" onSubmit={handleSubmit}>
					<div class = "inputForm" >
						<input 
							type="text" 
							placeholder = "name" 
							value = {title}
							onChange={(e)=>updateTitle(e.target.value)}
						/>
					</div>
					<div class = "button">
			        <input type = "image" src = {require("./pokeball.jpg")} class = "button" alt = "Submit"/>
					</div>
				</form>
			</div>			
			</div>			
			</div>
			</div>
		)	
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <InputForm/>;
root.render(element);
