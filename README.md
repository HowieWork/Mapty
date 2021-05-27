# MAPTY

###### \*Mapty is one project I learned from [Jonas Schmedtmann](https://www.udemy.com/course/the-complete-javascript-course/?referralCode=87FE8B1039A68106DEE5).

## BRIEF

An app maps your workouts | [**DEMO**](https://howiework.github.io/Mapty/)

<p>&nbsp;</p>

## KEYWORDS

OOP, Geolocation, External libraries, Project planning

<p>&nbsp;</p>

## FEATURES

### Interactive Map

- Indicate current location (Geolocation)
- Add new workouts
- Display all workouts on the map

### User Form

- Input distance, time, (pace, steps/minute), (speed, elevation gain)

### Interactive Workout List

- Display all workouts in the list
- Move map to workout location on click

### Workout data in the browser (Local storage API)

- Store workout data
- Read the saved data from local storage and display on page load

###### FIXME-highlight: NEW features I implemented (as challenges); \* FIXME-highlight: original features from the course;

<p>&nbsp;</p>

## TRACKING (TDL)

### Stage I

- [x] Project set-up
- [ ] Project planning
  - [x] User Stories
  - [x] Features
  - [x] Flowchart
  - [ ] Architecture
- [x] Use Geolocation API
- [x] Display a map using Leaflet Library
- [x] Display a map marker
- [x] Render workout input form
- [x] Project architecture
- [x] Refactor based on architecture
- [x] Manage workout data (create Classes)
- [x] Create a new workout
- [x] Render workouts
- [x] Move to marker on click
- [ ] Work with localStorage
- [ ] Stage II preparation

### Stage II

- [ ] TBD

<p>&nbsp;</p>

## DETAILS

### User Stories

<!-- prettier-ignore-start -->
| WHO | WHAT | WHY |
| --- | ---- | --- |
| User 1 | Log **running** workouts with `location`, `distance`, `time`, `pace` and `steps/minut` | Keep a log of all my running |
| User 2 | Log **cycling** workouts with `location`, `distance`, `time`, `speed` and `elevation gain` | Keep a log of all my cycling |
| User 3 | See all my workouts at a glance | Easily track my progress over time |
| User 4 | See my workouts on a map | Check where I work out the most |
| User 5 | See all my workouts when I leave the app and come back later | Keep using the app over time |
<!-- prettier-ignore-end -->

### Flowchart

![Mapty flowchart](./Mapty-flowchart.svg 'Mapty flowchart')

```mermaid
graph TD
    Event1([Page loads])
    Event2([User clicks on map])
    Event3([User submits new workout])
    Event4([User clicks on workout in list])
    Render1[Render map on current location]
    Render2[Render workout on map]
    Render3[Render workout in list]
    Render4[Render workout form]
    Render5[Move map to workout location]
    Operation1(Get current location coordinates)
    Operation2(Load workouts from local storage)
    Operation3(Store workouts in local storage)

    Event1 -->|Async| Operation1
    Event1 --> Operation2

    Operation1 --> Render1
    Operation1 --> |After map loaded| Render2

    Operation2 --> |After map loaded| Render2
    Operation2 --> Render3

    Render1 -.Bind handler.-> Event2
    Event2 --> Render4
    Render4 -.Bind handler.-> Event3

    Event3 --> Render2
    Event3 --> Render3
    Event3 --> Operation3

    Render3 -.Bind handler.-> Event4
    Event4 --> Render5
```

### Architecture

![Mapty architecture 1](./Mapty-architecture-1.svg 'Mapty architecture 1')

```mermaid
classDiagram
    Workout <|-- Running
    Workout <|-- Cycling
    Workout : id
    Workout : date
    Workout : coords
    Workout : distance
    Workout : duration
    Workout: constructor()
    class Running{
      pace
      name
      cadence
      constructor()
    }
    class Cycling{
      speed
      name
      elevationGain
      constructor()
    }
    class App{
      workouts
      map
      constructor()
      _getPosition()
      _loadMap(position)
      _showForm()
      _toggleElevationField()
      _newWorkout()
    }
```
