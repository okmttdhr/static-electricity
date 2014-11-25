// setInterval(Lightning_func.loop(), 1000 / 60);

// cs.beginPath(); // パスのリセット
// cs.lineWidth = 1;
// cs.strokeStyle = "#fff";
// cs.moveTo(0,10); // 開始位置
// cs.lineTo(200,10); // 次の位置
// cs.stroke(); // 描画


var context; // audio

var canvas_context;
var canvas;
var lightning;
var points;

var init = function() {
  $(document).ready(function() {
    console.log('init')
    bind_event.init();
    lightning_init();
  });

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

}

var bind_event = {
  init: function() {
    $('body').on('click', '#play', function(e) {
      e.preventDefault();
      audio();
    });

    $('body').on('click', '#play_oscillator', function(e) {
      e.preventDefault();
      oscillator.init();
    });
  }
}

var audio = function() {
  var buffer = context.createBuffer(1, 45000, 48000);
  var channel = buffer.getChannelData(0);

  for( var i=0; i < channel.length; i++ ) {
    channel[i] = Math.sin( i / 100 * Math.PI);
  }

  var src = context.createBufferSource();
  src.buffer = buffer;
  src.connect(context.destination);

  src.start(context.currentTime);
}

var oscillator = {
  init: function() {
    var self = this;
    osc = context.createOscillator();
    osc.frequency.value = 450;
    osc.type = (typeof osc.type === 'string') ? self.type.sawtooth[0] : self.type.sawtooth[1];
    osc.connect(context.destination);

    console.log(osc.type);

    osc.start = osc.start || osc.noteOn;
    osc.stop = osc.stop || osc.noteOff;

    osc.start(0);

    setTimeout(function() {
      osc.stop(0);
    },800);
  },
  type: {
    sine: ['sine', 0],
    square: ['square', 1],
    sawtooth: ['sawtooth', 2],
    triangle: ['triangle', 3]
  }
}

var Lightning = function(startPoint, endPoint, stepNum) {
  var self = this;

  //Lightningの開始ポイント
  var start = startPoint || new Point();

  //Lightningの終了ポイント
  var end = endPoint || new Point();

  //ステップ数。雷の刻む軌跡の数？
  var step = stepNum || 45;

  //開始と終了ポイントの距離
  var length = start.distance(end);

  //PerlinNoiseを生成
  var perlinNoise = new PerlinNoise(Math.floor(Math.random() * 1000) + 1);

  //PerlinNoiseのオクターブを6に設定
  perlinNoise.octaves(6);
  //perlinNoise.fallout(0.5);

  //オフセット？
  var off = 0;

  var points;

  //雷の子どもを格納する配列
  var children = [];

  // case by child
  var parent = null;
  var startStep = 0;
  var endStep = 0;
  var timer;

  // speed
  self.speed = 0.02;

  // line width
  self.lineWidth = 3;

  // blur size and color
  self.blur = 50;
  self.blurColor = 'rgba(255, 255, 255, 0.75)';

  //開始ポイントの位置のgetter/setter
  self.start = function(x, y) {
    if (!arguments.length) return start.clone();
    start.set(x, y);
  };

  //終了ポイントの位置のgetter/setter
  self.end = function(x, y) {
    if (!arguments.length) return end.clone();
    end.set(x, y);
  };

  //ステップ数のgetter/setter
  self.step = function(n) {
    if (!arguments.length) return step;
    step = Math.floor(n);
  };

  //開始〜終了ポイントの距離を返す
  self.length = function() {
    return start.distance(end);
  };

  //pointsからindex位置のpointを返す
  self.point = function(index) {
    return points[index];
  };

  //childrenのgetter/setter
  self.childNum = function(num) {
    if (arguments.length === 0) return children.length;

    if (children.length > num) {
      children.splice(num, children.length - num);

    } else {
      for (var i = children.length, child; i < num; i++) {
        child = new Lightning();
        child.speed = 0.03;
        child.lineWidth = 1.5;
        child.setAsChild(self);
        children.push(child);
      }
    }
  };

  //thisオブジェクト（Lightning）を子どもとして引数のLightningオブジェクトに登録
  self.setAsChild = function(lightning) {
    if (!(lightning instanceof Lightning)) return;

    parent = lightning;

    timer = new Timer(Math.floor(Math.random() * 1500) + 1);
    timer.onTimer = function() {
      this.delay = Math.floor(Math.random() * 1500) + 1;
      self.getStepsFromParent();
    };
    timer.start();
  };

  //親のLightningオブジェクトのstep数を取得
  self.getStepsFromParent = function() {
    if (!parent) return;
    var parentStep = parent.step();
    startStep = Math.floor(Math.random() * (parentStep - 2));
    endStep = startStep + Math.floor(Math.random() * (parentStep - startStep - 2)) + 2;
  };

  //update処理（位置計算のコア部分）
  self.update = function() {
    if (parent) {
      if (endStep > parent.step()) {
        this.getStepsFromParent();
      }

      start.set(parent.point(startStep));
      end.set(parent.point(endStep));
    }

    var length = self.length();
    var normal = end.subtract(start).normalize(length / step);
    var rad = normal.angle(); //正規化した値を元に角度を算出
    var sin = Math.sin(rad);
    var cos = Math.cos(rad);
    var i, len;

    points = [];
    off += self.speed;

    for (i = 0, len = step + 1; i < len; i++) {

      //+-逆転したoffset値でna, nbふたつのノイズを生成。
      //ふたつのノイズの差分を取り、それを元に微細なノイズをsin波に乗せて表示。
      var na = length * perlinNoise.noise(i / 50 - off);// * 1.5;
      var ax = sin * na;
      var ay = cos * na;

      var nb = length * perlinNoise.noise(i / 50 + off);// * 1.5;
      var bx = sin * nb;
      var by = cos * nb;

      //180度をステップ数で分割した値を使用。
      //両端は0、つまり位置を固定する。(sin(0)とsin(180)はともに0)
      var m = Math.sin((Math.PI * (i / (len - 1))));

      var x = start.x + normal.x * i + (ax - bx) * m;
      var y = start.y + normal.y * i - (ay - by) * m;

      points.push(new Point(x, y));
    }

    // Update children
    for (i = 0, len = children.length; i < len; i++) {
      children[i].update();
    }
  };

  //レンダリング処理
  //基本的に、格納されているpointsオブジェクトの位置にark(円)を描きつつ、
  //さらにその注視点をむすぶラインを引く処理
  self.draw = function(ctx) {
    var i, len, p;

    // Blur
    if (self.blur) {
      var d;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.shadowBlur = self.blur;
      ctx.shadowColor = self.blurColor;
      ctx.beginPath();
      for (i = 0, len = points.length; i < len; i++) {
        p = points[i];
        d = len > 1 ? p.distance(points[i === len - 1 ? i - 1 : i + 1]) : 0;
        ctx.moveTo(p.x + d, p.y);
        ctx.arc(p.x, p.y, d, 0, Math.PI * 2, false);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    ctx.save();
    ctx.lineWidth = Math.random() * self.lineWidth + 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.beginPath();
    for (i = 0, len = points.length; i < len; i++) {
      p = points[i];
      ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();

    // Draw children
    for (i = 0, len = children.length; i < len; i++) {
      children[i].draw(ctx);
    }
  };
}

function lightning_init() {
  var self = this;

  canvas = document.getElementById('audio_lightning__js');
  if(!canvas.getContext) {
    console.log('sorry');
    return false;
  }
  canvas_context = canvas.getContext('2d');

  points = [
    Point.create( 0, canvas.height / 2 ),
    Point.create( 415, canvas.height / 2 )
  ];

  //Lightningを生成
  lightning = new Lightning(Point.create(points[0]), Point.create(points[1]));

  setInterval("loop()", 1000 / 60);
}

function loop() {
  canvas_context.fillStyle = "#0b5693";
  canvas_context.fillRect(0, 0, canvas.width, canvas.height);

  lightning.start(points[0]);
  lightning.end(points[1]);
  lightning.step(Math.ceil(lightning.length() / 7.5));
  lightning.update();
  lightning.draw(canvas_context);
}


init();
