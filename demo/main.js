import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "../src/clojure"

let editorState = EditorState.create({
    doc: `(ns bird-watcher
  (:require [clojure.string :as string]))
        
(def birds-in-busy-day 5)
        
(def last-week [0 2 5 3 7 8 4])
        
(defn today [birds] (last birds))
      
(defn inc-bird [birds]
  (conj (pop birds) (inc (last birds))))
      
(inc-bird last-week)`,
    extensions: [basicSetup, clojure()]
})

new EditorView({
    state: editorState,
    parent: document.querySelector('#app')
}).focus()

let topLevelText = "Alt+Enter = Eval top-level form"
let keyBindings = "<strong>Key bindings:</strong>,Shift+Enter = Eval cell," +
    topLevelText + ",Ctrl/Cmd+Enter = Eval at cursor";
keyBindings = keyBindings.split(',');
for (let i = 0; i < keyBindings.length; i++)
    keyBindings[i] = "" + keyBindings[i] + "<br>";
keyBindings = keyBindings.join('');
document.getElementById("keymap").innerHTML = keyBindings;
