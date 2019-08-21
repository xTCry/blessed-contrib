/**
 * Author: xTCry (Vladislav Kh)
 * Example using Blessed and Blessed-Contrib
 * Poor code, but it works for an example
 */

const Blessed = require('@xtcry/blessed'); // or any other Blessed lib
const Contrib = new (require('..'))(Blessed);
const chalk = require('chalk');
// const qrcode = require('qrcode-terminal');

const cRECT = {
    C: 12,  // Columns // Height
    R: 12,  // Rows // Width
};


process.on('unhandledRejection', handleErrors);
process.on('uncaughtException', handleErrors);
function handleErrors(err) {
  console.error(err);
  if(display) {
    display.log("debug", {
      type: "err",
      name: err.name || "Z",
      data: `${err.message} :: [${err.stack.split('\n').splice(0, 3).join('\n')}]`,
    });
  }
}


class Display {
    
    constructor({ pids } = { pids: [] }) {
        this.pids = pids;

        this.Screen = Blessed.screen({ 
            smartCSR: true
        });
        this.Grid = new Contrib.grid({
            rows: cRECT.R,
            cols: cRECT.C,
            screen: this.Screen
        });

        this.Elements = {};
    }

    /**
     * Init Display
     * @method init
     * @return this
     */
    init() {
        
        const { pids } = this;
        // Is multiple mode
        const mp = pids.length > 1;
        this.stacked = (process.stdout.columns || 100) < 200;

        this.screenTitle("Loading...");

        this.logLines = {
            debug: [],
            all: [],
            pids: { /* [] */ },
        };

        this.setElements(mp);
        this.setElementsContent();

        this.Elements.accounts.focus();

        this.screenKeys();

        this.Screen.render();

        // qrcode.generate('https://github.com/xtcry', { small: !0 }, (qres) => {
        //     for(let e of qres.split('\n'))
        //         this.log("pid:0", {
        //             data: e,
        //             type: "in",
        //             name: "QR"
        //         })
        // });

        // async refresh of the ui
        setInterval(() => {
            this.Screen.render();
        }, 1e3);
        return this;
    }

    setElements(mp) {
        // Grid.set(row, col, rowSpan, colSpan, ...)

        // this.stacked? [ ID, userID, coins, status ]: [ ID, userID, userName, coins, status ]
        this.Elements.accounts = this.Grid.set(
            0, 0,
            (mp? cRECT.R: 0),
            (mp? 3: 0),
            Contrib.table, {
                label: ' PIDS ',
                keys: true,
                fg: 'white',
                columnSpacing: 1,
                columnWidth: this.stacked? [ 4, 10, 11, 4 ]: [ 4, 10, 12, 10, 4 ]
        });

        this.Elements.clog = this.Grid.set(
            0, (mp? 3: 0),
            cRECT.C - 3,
            (mp? cRECT.R - 5: cRECT.R - 2),
            Blessed.list, {
                label: ' Global Log ',
                
                scrollable: true,
                scrollbar: {
                    ch: ' ',
                    inverse: false
                },
                keys: true,
                autoCommandKeys: true,
                tags: true,
                border: {
                    type: 'line'
                },
                style: {
                    fg: 'white',
                    border: {
                        fg: 'white'
                    },
                    scrollbar: {
                        bg: 'blue',
                        fg: 'black'
                    }
                }
        });

        this.Elements.info = this.Grid.set(
            cRECT.R - 3, (mp? 3: 1),
            2, (mp? cRECT.R - 4: cRECT.R - 3),
            Blessed.box, {
                label: ' Information ',
                align: 'center',
                content: this.generateInfo
        });

        this.Elements.functions = this.Grid.set(
            0, (cRECT.R - 2),
            cRECT.C - 3, 2,
            Contrib.tree, {
                label: ' Functions ',
                style: {
                    fg: 'white',
                    border: {
                        fg: 'white'
                    },
                    scrollbar: {
                        bg: 'blue',
                        fg: 'black'
                    }
                }
        });
        
        this.Elements.functions.on('select', ({ name })=> {
            if (name == "Stop") {
                console.log("ZZZ::");
            }
        });

        this.Elements.cmdline = Blessed.textbox({
            label: 'CMD line [' + chalk.red('Tab') + ']',
            border: { type: "line", fg: "cyan" },
            bottom: 0,
            height: 3,
            width: (100 / cRECT.C * /*_*/5/*_*/) + "%",
            left: /*_*/(mp? (cRECT.R / 4): 0)/*_*/ * (100 / cRECT.C) + '%',
            keys: true,
            mouse: true,
            inputOnFocus: true,
            style: {
                fg: 'white',
                bg: 'blue'
            }
        });
        this.Screen.append(this.Elements.cmdline);

    }

    setElementsContent() {

        // Set Accounts
        const accHeaders = this.stacked? [
            chalk.cyan(' pID'),
            chalk.cyan(' uID'),
            chalk.cyan(' Coins'),
            chalk.cyan(' Status️'),
        ]: [
            chalk.cyan(' pID'),
            chalk.cyan(' uID'),
            chalk.cyan(' Name'), // *
            chalk.cyan(' Coins'),
            chalk.cyan(' Status'),
        ];

        const accData = [];

        this.pids.forEach((e,i) => {
            const row = [];
            row.push(i+1);
            row.push(e.userID);
            if(!this.stacked)
                row.push(e.userName);
            row.push(e.coins);
            row.push(e.status? chalk.green('ON'): chalk.red('OFF'));
            accData.push(row);
        });

        // ...
        ["All", "Dbg"].forEach((e, i) => {
            const row = [];
            row.push(e);
            row.push("-");
            if(!this.stacked)
                row.push("-");
            row.push("-");
            row.push("-");
            accData.push(row);      
        })

        this.Elements.accounts.setData({
            headers: accHeaders,
            data: accData
        });

        // Set Functions
        this.Elements.functions.setData({
            extended: true,
            children: {
                'Buy': {
                    children: {
                        'A': {},
                        'B': {},
                    }
                },
                'Stop': {},
                QR: {},
            }
        });

    }
    
    screenKeys() {
        this.Screen.key([ 'escape', 'C-c' ], (ch, key) => process.exit(0));

        this.Elements.cmdline.on('submit', (data) => {
            // TEST
            this.log("out", {
                data
            });

            this.Elements.cmdline.clearValue();
            this.Elements.cmdline.style.border.fg = 'white';
        });

        this.Screen.key('tab', (ch, key) => {
            this.Elements.cmdline.focus();
            this.Elements.cmdline.style.border.fg = 'red';
        });

        this.Screen.on('keypress', (char, e) => {
            if(["down", "up"].includes(e.full) && this.Elements.accounts.focused)
                this.logRefresh();
        })

        let i = 0;
        const Elements = [ 'accounts', 'clog', 'functions' ];
        this.Screen.key(['left', 'right'], (ch, key)=> {
            (key.name === 'left') ? i-- : i++;
            if (i == Elements.length)
                i = 0;
            if (i == -1)
                i = Elements.length-1;

            Object.keys(this.Elements).map((key, index)=> {
                let e = this.Elements[key];
                e.style.border.fg = 'white';
            });
            
            this.log("out", {
                data: Elements[i]
            });

            this.Elements[Elements[i]].style.border.fg = 'blue';
            this.Elements[Elements[i]].focus();
        });

    }

    screenTitle(title) {
        this.Screen.title = "xTMiner :: " + title;
    }

    // ...
    get currentPID() {
        return this.Elements.accounts.rows.selected;
    }

    get generateInfo() {
        let coins = 0;
        this.pids.forEach((e) => { coins += e.coins });

        return 'Accounts: ' + chalk.cyan(this.pids.length) + 
                '\tTotal coins: ' + chalk.yellow(coins) + 
                '\tTotal speed: ' + chalk.red('N/A') + 
                '\nSwitch panels: ' + chalk.red('Left or Right arrows') + 
                '\tCMD line: ' + chalk.red('Press Tab') + 
                '\tExit: ' + chalk.red('Escape');
    }


    log(type, data) {
        // Logs colors
        let color = '{white-fg}';
        switch (data.type) {
            case 'log':
                color = '{blue-fg}';
                break;
            case 'out':
                color = '{green-fg}';
                break;
            case 'err':
                color = '{red-fg}';
                break;
        }
        
        const pid = (type.split(':')[0] == "pid")? type.split(':')[1]: false;

        const logs = data.data.split('\n');
        logs.forEach((log) => {
            if (log.length > 0) {
                const msg = color + data.name + '{/} > ' + log;

                if(pid) {
                    this.logLines.all.push(msg);
                    if (this.logLines.all.length > 200) {
                        this.logLines.all.shift();
                    }
                    if(!this.logLines.pids[pid])
                        this.logLines.pids[pid] = [];
                    this.logLines.pids[pid].push(msg);
                    if (this.logLines.pids[pid].length > 200) {
                        this.logLines.pids[pid].shift();
                    }
                }
                else /* if(type == "debug") */ {
                    this.logLines.debug.push(msg);
                    if (this.logLines.debug.length > 200) {
                        this.logLines.debug.shift();
                    }
                }
                 
            }
        });

        this.logRefresh();
    }

    logRefresh() {
        let items = [];

        // Select "All"
        if(this.currentPID == this.pids.length) {
            items = this.logLines.all;
        }
        // Select "debug"
        else if(this.currentPID == this.pids.length + 1) {
            items = this.logLines.debug;
        }
        else {
            items = this.logLines.pids[this.currentPID];
        }       

        this.Elements.clog.setItems(items || ["None"]);
        if (!this.Elements.clog.focused) {
            this.Elements.clog.setScrollPerc(100);
        }
        this.Screen.render();
    }

}


const pids = [
    {
        name: "A",
        coins: 123,
        userName: "My name",
        status: true,
        userID: 46546,
    },
    {
        name: "B",
        coins: 3123,
        userName: "Bob H",
        status: true,
        userID: 85478,
    },
    {
        name: "C",
        coins: 144,
        userName: "Leq Z",
        status: false,
        userID: 15443,
    },
];

const display = new Display({ pids });
display.init();

function onEvent_Log(type, data) {
  display.log(type, data);
}

setInterval(() => {
    const id = rand(0, pids.length-1);

    const pid = pids[id];
    onEvent_Log("pid:" + id, {
        type: "log",
        name: pid.name,
        data: "z> [" + process.stdout.columns + "] " + Math.random(),
    });
}, 1500);


function rand(min, max) {
    if(max === void 0) {
        max = min; min = 0;
    }
    return Math.floor(min + Math.random() * (max + 1 - min));
}