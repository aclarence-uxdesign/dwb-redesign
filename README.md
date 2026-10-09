# Patient Room Whiteboard

Standalone room display for an LG TV-sized patient whiteboard. The screen matches the Digital Whiteboard registration and board flow: a device PIN, then the live board.

Landscape uses three columns (people, the day, clinical). Portrait uses two columns (people and safety on the left, the day plan and draw tools on the right). Cards, chips, icon buttons, and avatars follow the Web Mobile design system: outlined input chips, circular icon buttons, and the Bradford LL / Proxima Nova type pairing.

Bradford LL and Proxima Nova are commercial faces. If they are installed on the device they are used automatically. Otherwise the board falls back to Source Serif 4 and Inter.

## Run

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43117](http://127.0.0.1:43117).

The registration PIN is **2580**. After four digits the board opens. The fingerprint control locks the display and returns to registration.

## On the board

- Dim and On/Off change the room display. Both stay disabled while the draw box is open.
- Font scales the columns up or down.
- Draw opens the drawing box. The share icon sends the note by email. The X minimizes the box.
- The QR code opens `/companion` so a phone on the same browser origin can draw onto the board.

Use the Landscape, Portrait, and Auto controls at the lower left to preview both TV orientations. Auto follows the window.
