using System.Windows;
using System.Windows.Documents;
using System.Windows.Media;

namespace ShadScan.Client.Infrastructure.Adorners
{
    internal class DropTargetAdorner : Adorner
    {
        private readonly Pen _pen;
        private readonly Brush _fill;

        public DropTargetAdorner(UIElement adornedElement) : base(adornedElement)
        {
            _pen = new Pen(Brushes.DodgerBlue, 2);
            _pen.Freeze();
            _fill = new SolidColorBrush(Color.FromArgb(40, 30, 144, 255));
            _fill.Freeze();
            IsHitTestVisible = false;
        }

        protected override void OnRender(DrawingContext drawingContext)
        {
            var adornedElementRect = new Rect(this.AdornedElement.RenderSize);
            drawingContext.DrawRoundedRectangle(_fill, _pen, adornedElementRect, 4, 4);
        }
    }
}
