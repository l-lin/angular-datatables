/* Compile using: /usr/local/flex_sdk_4.12/bin/mxmlc --target-player=11.0.0 -static-link-runtime-shared-libraries=true -library-path+=lib ZeroClipboard.as */
package {
	import flash.display.Stage;
	import flash.display.Sprite;
	import flash.display.LoaderInfo;
	import flash.display.StageScaleMode;
	import flash.events.*;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.utils.*;
	import flash.system.System;
	import flash.net.FileReference;
	import flash.net.FileFilter;
	
	/* PDF imports */
	import org.alivepdf.pdf.PDF;
	import org.alivepdf.data.Grid;
	import org.alivepdf.data.GridColumn;
	import org.alivepdf.layout.Orientation;
	import org.alivepdf.layout.Size;
	import org.alivepdf.layout.Unit;
	import org.alivepdf.display.Display;
	import org.alivepdf.saving.Method;
	import org.alivepdf.fonts.FontFamily;
	import org.alivepdf.fonts.Style;
	import org.alivepdf.fonts.CoreFont;
	import org.alivepdf.colors.RGBColor;

	/* ZIP  imports */
	import deng.fzip.*;
 
	public class ZeroClipboard extends Sprite
	{
		private var domId:String = '';
		private var button:Sprite;
		private var clipText:String = 'blank';
		private var fileName:String = '';
		private var action:String = 'copy';
		private var sheetData:Object = {};


		public function ZeroClipboard() {
			// constructor, setup event listeners and external interfaces
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			flash.system.Security.allowDomain("*");
			
			// import flashvars
			var flashvars:Object = LoaderInfo( this.root.loaderInfo ).parameters;
			domId = flashvars.id.split("\\").join("\\\\");

			// Validate id to prevent scripting attacks. The id given is an integer
			if ( domId !== parseInt( domId, 10 ).toString() ) {
				throw new Error( 'Invalid DOM id' );
			}
			
			// invisible button covers entire stage
			button = new Sprite();
			button.buttonMode = true;
			button.useHandCursor = true;
			button.graphics.beginFill(0x00FF00);
			button.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			button.alpha = 0.0;
			addChild(button);
			
			button.addEventListener(MouseEvent.CLICK, function(event:Event):void {
				clickHandler(event);
			} );
			button.addEventListener(MouseEvent.MOUSE_OVER, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseOver', null );
			} );
			button.addEventListener(MouseEvent.MOUSE_OUT, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseOut', null );
			} );
			button.addEventListener(MouseEvent.MOUSE_DOWN, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseDown', null );
			} );
			button.addEventListener(MouseEvent.MOUSE_UP, function(event:Event):void {
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'mouseUp', null );
			} );
			
			// External functions - readd whenever the stage is made active for IE
			addCallbacks();
			stage.addEventListener(Event.ACTIVATE, addCallbacks);

			// signal to the browser that we are ready
			ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'load', null );
		}

		public function log ( str:String ):void
		{
			ExternalInterface.call( 'ZeroClipboard_TableTools.log', str, null );
		}
		

		public function addCallbacks (evt:Event = null):void
		{
			ExternalInterface.addCallback( "setHandCursor", function(enabled:Boolean):void {
				button.useHandCursor = enabled;
			} );

			ExternalInterface.addCallback( "clearText", function():void {
				clipText = '';
			} );

			ExternalInterface.addCallback( "setText", function(t:String):void {
				clipText = t;
			} );

			ExternalInterface.addCallback( "appendText", function(t:String):void {
				clipText += t;
			} );

			ExternalInterface.addCallback( "setFileName", function(t:String):void {
				fileName = t;
			} );

			ExternalInterface.addCallback( "setAction", function(t:String):void {
				action = t;
			} );

			ExternalInterface.addCallback( "setSheetData", function(t:String):void {
				sheetData = JSON.parse( t );
			} );

		}

		private function addToZip( zip:FZip, dir:String, obj:Object ):void {
			for ( var s:String in obj ) {
				if ( typeof obj[s] === 'string' ) {
					addFile( zip, dir+s, obj[s] );
				}
				else {
					addToZip( zip, dir+s+'/', obj[s] );
				}
			}
		}

		private function addFile( zip:FZip, filePath:String, str:String ):void {
			var bytes:ByteArray = new ByteArray();
			bytes.writeUTFBytes( str );

			zip.addFile( filePath, bytes );
		}

		private function clickHandler(event:Event):void
		{
			var fileRef:FileReference = new FileReference();
			fileRef.addEventListener(Event.COMPLETE, saveComplete);
			
			if ( action == "csv" ) {
				// Simple save of the inbound data
				var bytes:ByteArray = new ByteArray();

				bytes.writeUTFBytes( clipText );
				fileRef.save( bytes, fileName );
			}
			else if ( action == "excel" ) {
				// Create an XLSX file using FZip and a set of predefined strings
				var zip:FZip = new FZip();

				addToZip( zip, '', sheetData );

				var out:ByteArray = new ByteArray();
				zip.serialize( out );

				fileRef.save( out, fileName );
			}
			else if ( action == "pdf" ) {
				// Save as a PDF
				var pdf:PDF = configPdf();
				fileRef.save( pdf.save( Method.LOCAL ), fileName );
			}
			else {
				// Copy the text to the clipboard
				System.setClipboard( clipText );
				ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'complete', clipText );
			}
		}
		
		
		private function saveComplete(event:Event):void
		{
			ExternalInterface.call( 'ZeroClipboard_TableTools.dispatch', domId, 'complete', clipText );
		}
		
		
		private function configPdf():PDF
		{
			var json:Object   = JSON.parse( clipText );
			var columns:Array = [];

			// Create the PDF
			var pdf:PDF = new PDF(
				Orientation[ json.orientation.toUpperCase() ],
				Unit.MM,
				Size[ json.size.toUpperCase() ]
			);

			pdf.setDisplayMode( Display.FULL_WIDTH );
			pdf.addPage();

			var pageWidth:int = pdf.getCurrentPage().w-20;
			
			// Add the title / message if there is one
			pdf.textStyle( new RGBColor(0), 1 );
			pdf.setFont( new CoreFont(FontFamily.HELVETICA), 14 );
			if ( json.title != "" ) {
				pdf.writeText(11, json.title+"\n");
			}
			
			pdf.setFont( new CoreFont(FontFamily.HELVETICA), 11 );
			if ( json.message != "" ) {
				pdf.writeText(11, json.message+"\n");
			}

			for ( var i:int=0, ien:int=json.header.length ; i<ien ; i++ ) {
				columns.push( new GridColumn(
					" \n"+json.header[i]+"\n ", // text
					i.toString(),               // data field
					json.colWidth[i]*pageWidth, // width
					'C'                         // align
				) );
			}
			
			var grid:Grid = new Grid(
				json.body,                /* 1. data */
				pageWidth,                /* 2. width */
				100,                      /* 3. height */
				new RGBColor (0xE0E0E0),  /* 4. headerColor */
				new RGBColor (0xFFFFFF),  /* 5. backgroundColor */
				true,                     /* 6. alternateRowColor */
				new RGBColor ( 0x0 ),     /* 7. borderColor */
				.1,                       /* 8. border alpha */
				null,                     /* 9. joins */
				columns                   /* 10. columns */
			);
			
			pdf.addGrid( grid, 0, 0 );
			return pdf;
		}
	}
}
