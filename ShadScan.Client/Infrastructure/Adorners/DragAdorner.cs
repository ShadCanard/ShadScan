using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;

namespace ShadScan.Client.Infrastructure.Adorners
{
    internal class DragAdorner : Adorner
    {
        private readonly FrameworkElement _child;
        private double _left;
        private double _top;

        public DragAdorner(UIElement adornedElement, FrameworkElement dragVisual) : base(adornedElement)
        {
            _child = new Border
            {
                Width = dragVisual.ActualWidth,
                Height = dragVisual.ActualHeight,
                Child = new System.Windows.Shapes.Rectangle
                {
                    Fill = new VisualBrush(dragVisual) { Stretch = Stretch.Uniform },
                    Opacity = 0.85
                },
                Background = Brushes.Transparent,
                IsHitTestVisible = false
            };

            AddVisualChild(_child);
        }

        public void SetPosition(double left, double top)
        {
            _left = left;
            _top = top;
            InvalidateVisual();
            InvalidateArrange();
        }

        protected override int VisualChildrenCount => 1;

        protected override Visual GetVisualChild(int index) => _child;

        protected override Size MeasureOverride(Size constraint)
        {
            _child.Measure(constraint);
            return _child.DesiredSize;
        }

        protected override Size ArrangeOverride(Size finalSize)
        {
            _child.Arrange(new Rect(new Point(_left, _top), _child.DesiredSize));
            return finalSize;
        }
    }
}
