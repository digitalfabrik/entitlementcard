import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class ContactInfoRow extends StatelessWidget {
  final IconData _icon;
  final String _description;
  final String _semanticLabel;
  final Function onTap;

  ContactInfoRow(this._icon, this._description, this._semanticLabel,
      {this.onTap});

  @override
  Widget build(BuildContext context) {
    return _description != null && _description.isNotEmpty
        ? Row(children: [
            Padding(
                padding: EdgeInsets.only(top: 6, bottom: 6, right: 16),
                child: ClipOval(
                  child: Container(
                    width: 42,
                    height: 42,
                    child: Icon(
                      _icon,
                      size: 28,
                      semanticLabel: _semanticLabel,
                    ),
                    color: Theme.of(context).primaryColorLight,
                  ),
                )),
            Expanded(
                child: (onTap == null)
                    ? Text(
                        _description,
                      )
                    : InkWell(
                        child: Text(
                          _description,
                          style: Theme.of(context).textTheme.bodyText2.merge(
                              TextStyle(color: Theme.of(context).accentColor)),
                        ),
                        onTap: onTap,
                      ))
          ])
        : Container(width: 0, height: 0);
  }
}
