import { Image } from 'react-native';

const imageButtonToSpeak = require('../../assets/speakButtonImage.png');
const imageButtonToMemories = require('../../assets/memoriesButtonImage.png');
const imageButtonToRoutines = require('../../assets/routinesButtonImage.png');;

const imageSpeak = Image.resolveAssetSource(imageButtonToSpeak).uri;
const imageMemories = Image.resolveAssetSource(imageButtonToMemories).uri;
const imageRoutines = Image.resolveAssetSource(imageButtonToRoutines).uri;

export const menuNav = [
    {
        label: 'Rutinas',
        goto: 'Routines',
        image: imageRoutines,
    },
    {
        label: 'Empezemos a Hablar',
        goto: 'Speak',
        image: imageSpeak,
    },
    {
        label: 'Memorias',
        goto: 'Memories',
        image: imageMemories,
    }
]